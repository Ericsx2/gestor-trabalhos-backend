import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

class SubjectController {
  async index(request: Request, response: Response) {
    const { page, offset } = request.query;
    const rowsPerPage = Number(offset);
    try {
      const subjects = await prismaClient.subject.findMany({
        skip: (Number(page) - 1) * rowsPerPage,
        take: rowsPerPage,
        where: {
          deleted: false,
        },
      });

      return response.send(subjects);
    } catch {
      return response.status(500).send();
    }
  }

  async store(request: Request, response: Response) {
    const { name, code } = request.body;

    try {
      const nameAlreadyExists = await prismaClient.subject.findFirst({
        where: {
          name,
        },
      });

      if (nameAlreadyExists) {
        return response
          .status(302)
          .send({ message: 'Disciplina já existente!' });
      }

      const codeAlreadyExists = await prismaClient.subject.findFirst({
        where: {
          code,
        },
      });

      if (codeAlreadyExists) {
        return response
          .status(302)
          .send({ message: 'Código da disciplina já existente!' });
      }

      const subject = await prismaClient.subject.create({
        data: {
          name,
          code,
        },
      });

      return response.send({ message: 'Disciplina criada com sucesso!' });
    } catch {
      return response.status(500).send();
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const subject = await prismaClient.subject.findFirst({
        where: {
          id,
        },
        include: {
          projects: true,
        },
      });

      if (!subject) {
        return response
          .status(404)
          .send({ message: 'Disciplina não encontrada!' });
      }

      return response.send({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        projects: subject.projects,
      });
    } catch {
      return response.status(500).send();
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, code } = request.body;

    try {
      const subject = await prismaClient.subject.findFirst({
        where: {
          id,
        },
      });

      if (!subject) {
        return response
          .status(404)
          .send({ message: 'Disciplina não encontrada!' });
      }

      const subjectUpdated = await prismaClient.subject.update({
        data: {
          name,
          code,
        },
        where: {
          id,
        },
      });

      return response.send({ message: 'Disciplina alterada com sucesso!' });
    } catch {
      return response.status(500).send();
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const deletedSubject = await prismaClient.subject.update({
        data: {
          deleted: true,
        },
        where: {
          id,
        },
      });

      return response.send({ message: 'Usuário deletado com sucesso' });
    } catch {
      return response.status(500).send();
    }
  }
}

export { SubjectController };
