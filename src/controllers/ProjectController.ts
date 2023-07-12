import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { ProjectIMailOptions, transporter } from '../modules/SendEmailModule';

class ProjectController {
  async index(request: Request, response: Response) {
    const { page } = request.query;
    const offset = 10;

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

  async recents(request: Request, response: Response) {
    try {
      const projects = await prismaClient.project.findMany({
        take: 5,
        orderBy: {
          created_at: 'desc',
        },
      });

      return response.status(200).json(
        projects.map((project) => {
          return {
            id: project.id,
            title: project.title,
            description: project.description,
            owner: project.owner,
            created_at: project.created_at,
          };
        })
      );
    } catch {
      return response.status(500).send();
    }
  }

  async search(request: Request, response: Response) {
    const { search } = request.query;

    try {
      const projects = await prismaClient.project.findMany({
        where: {
          title: {
            contains: search as string,
          },
        },
      });

      return response.status(200).json(
        projects.map((project) => {
          return {
            id: project.id,
            title: project.title,
            description: project.description,
          };
        })
      );
    } catch {
      return response.status(500).send();
    }
  }

  async publicShow(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const project = await prismaClient.project.findFirst({
        where: {
          id,
        },
        include: {
          Users: {
            include: {
              user: {
                select: {
                  name: true,
                  last_name: true,
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!project) {
        return response.status(404).send({ message: 'Projeto não encontrado' });
      }

      const teacher = project.Users.find(
        (item) => item.user.role === 'Teacher'
      );
      const student = project.Users.find(
        (item) => item.user.role === 'Student'
      );

      return response.status(200).json({
        id: project.id,
        title: project.title,
        description: project.description,
        owner: project.owner,
        created_at: project.created_at,
        teacher: `${teacher?.user.name} ${teacher?.user.last_name}`,
        student: `${student?.user.name} ${student?.user.last_name}`,
      });
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
      owner,
    } = request.body;
    console.log(request.body);

    try {
      const projectAlreadyExists = await prismaClient.project.findFirst({
        where: {
          title,
        },
      });

      if (projectAlreadyExists) {
        return response
          .status(404)
          .json({ message: 'Projeto com esse título já foi cadastrado!' });
      }

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

      const project = await prismaClient.project.create({
        data: {
          title,
          description,
          owner,
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

      console.log(request.files);
      const banner = request.files['banner'][0];
      const project_file = request.files['project_file'][0];

      const project_files = await prismaClient.projectFile.create({
        data: {
          name: project.title,
          url: project_file.path,
          projectId: project.id,
          type: project_file.fieldname,
        },
      });

      const banner_file = await prismaClient.projectFile.create({
        data: {
          name: project.title,
          url: banner.path,
          projectId: project.id,
          type: banner.fieldname,
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
    } catch (error) {
      console.log(error);
      return response.status(500).send({ message: error });
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
      owner,
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

      const project = await prismaClient.project.update({
        data: {
          title,
          description,
          owner,
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
    } catch (e) {
      console.log(e);
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
