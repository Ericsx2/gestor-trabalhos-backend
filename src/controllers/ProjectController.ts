import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { ProjectIMailOptions, transporter } from '../modules/SendEmailModule';

class ProjectController {
  async index(request: Request, response: Response) {
    const { page, offset } = request.query;
    const rowsPerPage = Number(offset);
    try {
      const projects = await prismaClient.project.findMany({
        skip: (Number(page) - 1) * rowsPerPage,
        take: rowsPerPage,
      });

      return response.status(200).json(projects);
    } catch {
      return response.status(500).send();
    }
  }

  async store(request: Request, response: Response) {
    const {
      title,
      description,
      registration_teacher,
      registration_student,
      registration_subject,
    } = request.body;

    try {
      const student = await prismaClient.user.findFirst({
        where: {
          registration: registration_student,
        },
      });

      if (!student) {
        return response
          .status(404)
          .json({ message: 'Aluno não foi encontrado!' });
      }

      const teacher = await prismaClient.user.findFirst({
        where: {
          registration: registration_teacher,
        },
      });

      if (!teacher) {
        return response
          .status(404)
          .json({ message: 'Professor não foi encontrado!' });
      }

      const subject = await prismaClient.subject.findFirst({
        where: {
          code: registration_subject,
        },
      });

      if (!subject) {
        return response
          .status(404)
          .json({ message: 'Matéria não foi encontrada!' });
      }

      const project = await prismaClient.project.create({
        data: {
          title,
          description,
          subjectId: subject.id,
          Users: {
            create: [
              {
                userId: student.id,
              },
              {
                userId: teacher.id,
              },
            ],
          },
        },
      });

      const link = `http://127.0.0.1:3333/projects/${project.id}`;

      const mailOptions: ProjectIMailOptions = {
        to: [student.email, teacher.email],
        from: `${process.env.SMTP_USER}`,
        subject: 'Seu projeto foi criado com sucesso!',
        template: 'project_created',
        text: `Seu trabalho foi adicionado\nDocente: ${teacher.name} ${teacher.last_name}\n
              Discente: ${student.name} ${student.last_name}\nVeja seu projeto em: ${link}`,
        context: {
          title,
          link,
          student: {
            name: student.name,
            last_name: student.last_name,
          },
          teacher: {
            name: teacher.name,
            last_name: teacher.last_name,
          },
        },
      };

      await transporter.sendMail(mailOptions).catch((error) => {
        if (error) {
          return response
            .status(500)
            .send({ message: 'Erro ao enviar email', error });
        }
      });

      return response.send({ message: 'Projeto criado com sucesso' });
    } catch {
      return response.status(500).send();
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const project = await prismaClient.project.findFirst({
        where: {
          id,
        },
      });

      if (!project) {
        return response.status(404).send({ message: 'Projeto não encontrado' });
      }

      return response.status(200).json({
        project,
      });
    } catch {
      return response.status(500).send();
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const {
      title,
      description,
      registration_teacher,
      registration_student,
      registration_subject,
    } = request.body;

    try {
      const titleAlreadyExists = await prismaClient.project.findFirst({
        where: {
          title,
        },
      });

      const descriptionAlreadyExists = await prismaClient.project.findFirst({
        where: {
          description,
        },
      });

      const student = await prismaClient.user.findFirst({
        where: {
          registration: registration_student,
        },
      });

      if (!student) {
        return response
          .status(404)
          .json({ message: 'Aluno não foi encontrado!' });
      }

      const teacher = await prismaClient.user.findFirst({
        where: {
          registration: registration_teacher,
        },
      });

      if (!teacher) {
        return response
          .status(404)
          .json({ message: 'Professor não foi encontrado!' });
      }

      const subject = await prismaClient.subject.findFirst({
        where: {
          code: registration_subject,
        },
      });

      if (!subject) {
        return response
          .status(404)
          .json({ message: 'Matéria não foi encontrada!' });
      }

      const project = await prismaClient.project.update({
        data: {
          title,
          description,
          Users: {
            create: [
              {
                userId: student.id,
              },
              {
                userId: teacher.id,
              },
            ],
          },
        },
        where: {
          id,
        },
      });

      return response.send({ message: 'Projeto alterado com sucesso' });
    } catch {
      return response.status(500).send();
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const deletedProject = await prismaClient.project.delete({
        where: {
          id,
        },
      });

      return response
        .status(200)
        .json({ message: 'Projeto deletado com sucesso' });
    } catch {
      return response.status(500).send();
    }
  }

  async approve(request: Request, response: Response) {
    const { id } = request.body;

    try {
      const project = await prismaClient.project.findUnique({
        where: { id },
      });

      if (!project) {
        return response.status(404).send({ message: 'Projeto não encontrado' });
      }

      const approvedProject = await prismaClient.project.update({
        data: {
          accepted: true,
        },
        where: { id },
      });

      return response.send();
    } catch {
      return response.status(500).send();
    }
  }

  async reject(request: Request, response: Response) {
    const { id } = request.body;

    try {
      await prismaClient.project.delete({
        where: { id },
      });

      return response.send();
    } catch {
      return response.status(500).send();
    }
  }
}

export { ProjectController };
