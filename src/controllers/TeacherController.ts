import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { hashSync, genSaltSync } from 'bcrypt';
import { IMailOptions, transporter } from '../modules/SendEmailModule';
require('dotenv').config();

class TeacherController {
    async index(_: Request, response: Response) {
        const teachers = await prismaClient.teacher.findMany({
            where: {
                deleted: false,
            }
        });

        return response.send(teachers);
    }

    async store(request: Request, response: Response) {
        const { name, last_name, registration, email } = request.body;

        const nameAlreadyExists = await prismaClient.teacher.findFirst({
            where: {
                name,
            }
        });

        if (nameAlreadyExists) {
            return response.status(302).send({ message: 'Nome já existente!' });
        }

        const emailAlreadyExists = await prismaClient.teacher.findFirst({
            where: {
                email
            }
        });

        if (emailAlreadyExists) {
            return response.status(302).send({ message: 'Email já existente!' });
        }

        const salt = genSaltSync(10);
        const generatedPassword = generate({
            length: 10,
            numbers: true,
            symbols: true,
        });
        const hashedPassword = hashSync(generatedPassword, salt);

        const teacher = await prismaClient.teacher.create({
            data: {
                name,
                email,
                last_name,
                registration,
                password: hashedPassword,
            },
        });

        const mailOptions: IMailOptions = {
            to: email,
            from: `COLCIC <${process.env.SMTP_USER}>`,
            subject: 'Primeiro Acesso',
            text: `Olá ${name}, essa é a sua senha temporária ${hashedPassword}, para alterar entre no link`,
            template: 'firstAcess',
            context: { 
              subject: 'Primeiro Acesso',
              name,
              link: 'https://www.google.com',
              password: hashedPassword,
            },
          }
      
          await transporter.sendMail(mailOptions).catch((error) => {
            if (error) {
              return response
                .status(500)
                .send({ message: 'Erro ao enviar email', error });
            }
          });

        return response.send({ message: 'Usuário criado com sucesso' });
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const teacher = await prismaClient.teacher.findFirst({
            where: {
                id,
            },
            include:{
                projects: true,
            }
        });

        if (!teacher) {
            return response.status(404).send({ message: 'Usuário não encontrado' });
        }

        return response.send({
            id: teacher.id,
            name: teacher.name,
            last_name: teacher.last_name,
            email: teacher.email,
            role: teacher.role,
            projects: teacher.projects,
        });
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { name, last_name, registration, email } = request.body;

        const teacher = await prismaClient.teacher.findFirst({
            where: {
                id,
            },
        });

        if (!teacher) {
            return response.status(404).send({ message: 'Usuário não encontrado' });
        }

        const teacherUpdated = await prismaClient.teacher.update({
            data: {
                name,
                email,
                last_name,
                registration,
            },
            where: {
                id,
            },
        });

        return response.send({ message: 'usuário alterado com sucesso' });
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const deletedTeacher = await prismaClient.teacher.update({
            data: {
                deleted: true,
            },
            where: {
                id,
            },
        });

        return response.send({ message: 'Usuário deletado com sucesso' });
    }
}

export { TeacherController };