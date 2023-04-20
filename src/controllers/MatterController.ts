import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { hashSync, genSaltSync } from 'bcrypt';

class MatterController {
  async index(_: Request, response: Response) {
    const matters = await prismaClient.matter.findMany();

    return response.status(200).json(matters);
  }

  async store(request: Request, response: Response) {
    const { name } = request.body;

    const matterAlreadyExists = await prismaClient.matter.findFirst({
      where: {
        name,
      },
    });

    if (matterAlreadyExists) {
      return response.status(302).send({ message: 'A matéria já existente!' });
    }

    const matter = await prismaClient.matter.create({
      data: {
        name,
      },
    });

    return response.status(201).json({ message: 'Matéria criada com sucesso' });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const matter = await prismaClient.matter.findFirst({
      where: {
        id,
      },
    });

    if (!matter) {
      return response.status(404).send({ message: 'Matéria não encontrado' });
    }

    return response.status(302).json({
      id: matter.id,
      name: matter.name,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name } = request.body;

    const matter = await prismaClient.matter.findFirst({
      where: {
        id,
      },
    });

    if (!matter) {
      return response.status(404).send({ message: 'Matéria não encontrada' });
    }

    const matterUpdated = await prismaClient.matter.update({
      data: {
        name,
      },
      where: {
        id,
      },
    });

    return response.status(200).json({ message: 'Matéria alterada com sucesso' });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deletedMatter = await prismaClient.matter.delete({
      where: { id: id },
    });

    return response.send({ message: 'Matéria deletada com sucesso' });
  }
}

export { MatterController };
