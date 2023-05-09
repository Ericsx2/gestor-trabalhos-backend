import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { hashSync, genSaltSync } from 'bcrypt';
import { IMailOptions, transporter } from '../modules/SendEmailModule';
require('dotenv').config();

class CoordenationController {
  async index(_: Request, response: Response) {
    const coordenations = await prismaClient.coordenation.findMany({
      where: {
        deleted: false,
      },
    });

    return response.send(coordenations);
  }

  async store(request: Request, response: Response) {
    const { name, last_name, email, phone, ddd } = request.body;

    const nameAlreadyExists = await prismaClient.coordenation.findFirst({
      where: {
        name,
      },
    });

    if (nameAlreadyExists) {
      return response.status(302).send({ message: 'Nome já existente!' });
    }

    const emailAlreadyExists = await prismaClient.coordenation.findFirst({
      where: {
        email,
      },
    });

    if (emailAlreadyExists) {
      return response.status(302).send({ message: 'Email já existente!' });
    }

    const phoneAlreadyExists = await prismaClient.coordenation.findFirst({
      where: {
        phone,
      },
    });

    if (phoneAlreadyExists) {
      return response.status(302).send({ message: 'Telefone já existente!' });
    }

    const salt = genSaltSync(10);
    const generatedPassword = generate({
      length: 10,
      numbers: true,
      symbols: true,
    });

    const hashedPassword = hashSync(generatedPassword, salt);

    const coordenation = await prismaClient.coordenation.create({
      data: {
        name,
        email,
        last_name,
        phone,
        ddd,
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
    };

    await transporter.sendMail(mailOptions).catch((error) => {
      if (error) {
        return response
          .status(500)
          .send({ message: 'Erro ao enviar email', error });
      }
    });

    return response.send({ message: 'Usuário criado com sucesso!' });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const coordenation = await prismaClient.coordenation.findFirst({
      where: {
        id,
      },
    });

    if (!coordenation) {
      return response.status(404).send({ message: 'Usuário não encontrado!' });
    }

    return response.send({
      id: coordenation.id,
      name: coordenation.name,
      last_name: coordenation.last_name,
      email: coordenation.email,
      phone: coordenation.phone,
      ddd: coordenation.ddd,
      role: coordenation.role,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, last_name, email, phone, ddd } = request.body;

    const coordenation = await prismaClient.coordenation.findFirst({
      where: {
        id,
      },
    });

    if (!coordenation) {
      return response.status(404).send({ message: 'Usuário não encontrado!' });
    }

    const coordenationUpdated = await prismaClient.coordenation.update({
      data: {
        name,
        email,
        last_name,
        phone,
        ddd,
      },
      where: {
        id,
      },
    });

    return response.send({ message: 'Usuário alterado com sucesso!' });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deletedcoordenation = await prismaClient.coordenation.update({
      data: {
        deleted: true,
      },
      where: {
        id,
      },
    });

    return response.send({ message: 'Usuário deletado com sucesso!' });
  }
}

export { CoordenationController };
