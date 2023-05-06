import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { hashSync, genSaltSync } from 'bcrypt';

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

        const emailAlreadyExists = await prismaClient.user.findFirst({
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

        const user = await prismaClient.user.create({
            data: {
                email,
                role: 1,
                password: hashedPassword,
            }
        });

        const teacher = await prismaClient.teacher.create({
            data: {
                name,
                last_name,
                registration,
                userId: user.id,
            },
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