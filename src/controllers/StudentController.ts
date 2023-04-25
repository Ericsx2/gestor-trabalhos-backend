import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { hashSync, genSaltSync } from 'bcrypt';

class StudentController {
  async index(_: Request, response: Response) {
    const students = await prismaClient.student.findMany({
      where: {
        deleted: false,
      },
    });

    return response.send(students);
  }

  async store(request: Request, response: Response) {
    const { name, last_name, registration, email } = request.body;

    const nameAlreadyExists = await prismaClient.student.findFirst({
      where: {
        name,
      },
    });

    if (nameAlreadyExists) {
      return response.status(302).send({ message: 'Nome já existente!' });
    }

    const emailAlreadyExists = await prismaClient.student.findFirst({
      where: {
        email,
      },
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

    const student = await prismaClient.student.create({
      data: {
        name,
        email,
        last_name,
        registration,
        password: hashedPassword,
      },
    });

    return response.send({ message: 'Usuário criado com sucesso' });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const student = await prismaClient.student.findFirst({
      where: {
        id,
      },
    });

    if (!student) {
      return response.status(404).send({ message: 'Usuário não encontrado' });
    }

    return response.send({
      id: student.id,
      name: student.name,
      last_name: student.last_name,
      email: student.email,
      role: student.role,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, last_name, registration, email } = request.body;


    const student = await prismaClient.student.findFirst({
      where: {
        id,
      },
    });

    if (!student) {
      return response.status(404).send({ message: 'Usuário não encontrado' });
    }

    const studentUpdated = await prismaClient.student.update({
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

    const deletedStudent = await prismaClient.student.update({
      data: {
        deleted: true,
      },
      where: {
        id,
      },
    });

    return response.send({ message: 'usuário deletado com sucesso' });
  }
}

export { StudentController };
