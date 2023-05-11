import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { hashSync, genSaltSync } from 'bcrypt';

class CoordenationController {
  async index(_: Request, response: Response) {
    const coordenations = await prismaClient.user.findMany({
      where: {
        deleted: false,
      },
    });

    return response.send(coordenations);  
  }

  async store(request: Request, response: Response) {
    const { name, last_name, registration, email } = request.body;

    const nameAlreadyExists = await prismaClient.user.findFirst({
      where: {
        name,
      },
    });

    if (nameAlreadyExists) {
      return response.status(302).send({ message: 'Nome já existente!' });
    }

    const emailAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (emailAlreadyExists) {
      return response.status(302).send({ message: 'Email já existente!' });
    }

    const registrationAlreadyExists = await prismaClient.user.findFirst({
      where: {
        registration,
      },
    });

    if (registrationAlreadyExists) {
      return response.status(302).send({ message: 'Matrícula já existente!' });
    }

    const salt = genSaltSync(10);
    const generatedPassword = generate({
      length: 10,
      numbers: true,
      symbols: true,
    });
    const hashedPassword = hashSync(generatedPassword, salt);

    const coordenation = await prismaClient.user.create({
      data: {
        name,
        email,
        last_name,
        password: hashedPassword,
        role: 0,
        registration,
      },
    });

    return response.send({ message: 'Usuário criado com sucesso!' });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const coordenation = await prismaClient.user.findFirst({
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
      role: coordenation.role
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, last_name, email } = request.body;

    const coordenation = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });

    if (!coordenation) {
      return response.status(404).send({ message: 'Usuário não encontrado!' });
    }

    const coordenationUpdated = await prismaClient.user.update({
      data: {
        name,
        email,
        last_name,
      },
      where: {
        id,
      },
    });

    return response.send({ message: 'Usuário alterado com sucesso!' });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deletedcoordenation = await prismaClient.user.update({
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
