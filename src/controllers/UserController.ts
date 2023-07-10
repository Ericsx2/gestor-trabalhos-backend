import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { genSaltSync, hashSync } from 'bcrypt';
import { IMailOptions, transporter } from '../modules/SendEmailModule';

class UserController {
  async index(request: Request, response: Response) {
    const { page, offset } = request.query;

    const rowsPerPage = Number(offset) || 10;
    const skip = Number(page) - 1 || 0;
    try {
      const users = await prismaClient.user.findMany({
        skip: skip * rowsPerPage,
        take: rowsPerPage,
        where: {
          deleted: false,
        },
      });

      const usersCount = await prismaClient.user.count();

      return response.send({ users, count: usersCount });
    } catch (error) {
      console.log(error);
      return response.status(500).send();
    }
  }

  async store(request: Request, response: Response) {
    const { name, last_name, registration, email, role } = request.body;
    console.log(request.body);

    try {
      const emailAlreadyExists = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });

      if (emailAlreadyExists) {
        return response.status(302).send({ message: 'Email já existente!' });
      }

      const registrationAlreadyExists = await prismaClient.user.findUnique({
        where: {
          registration,
        },
      });

      if (registrationAlreadyExists) {
        return response
          .status(302)
          .send({ message: 'Matrícula já existente!' });
      }

      const registrationRequestUpdated =
        await prismaClient.registrationRequest.update({
          data: {
            was_created: true,
          },
          where: {
            registration,
          },
        });

      const salt = genSaltSync(10);
      const generatedPassword = generate({
        length: 10,
        numbers: true,
        symbols: true,
      });
      const hashedPassword = hashSync(generatedPassword, salt);

      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          last_name,
          registration,
          password: hashedPassword,
          role,
        },
      });

      const link = 'http://127.0.0.1:3333/user/546218/changePassword';

      const mailOptions: IMailOptions = {
        to: email,
        from: `COLCIC <${process.env.SMTP_USER}>`,
        subject: 'Primeiro Acesso',
        text: `Olá ${name}, essa é a sua senha provisória: ${generatedPassword}\nAltere em: ${link}`,
        template: 'first_access',
        context: {
          subject: 'Primeiro Acesso',
          name,
          link,
          password: generatedPassword,
        },
      };

      await transporter.sendMail(mailOptions).catch((error) => {
        if (error) {
          return response
            .status(500)
            .send({ message: 'Erro ao enviar email', error });
        }
      });

      return response.send({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      return response.status(500).send({ message: error });
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) {
        return response.status(404).send({ message: 'Usuário não encontrado' });
      }

      return response.send({
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        registration: user.registration,
        role: user.role,
      });
    } catch {
      return response.status(500).send();
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, last_name, registration, email } = request.body;

    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) {
        return response.status(404).send({ message: 'Usuário não encontrado' });
      }

      if (id != user.id) {
        return response
          .status(404)
          .send({ message: 'Usuário não possui permissão.' });
      }

      const userUpdated = await prismaClient.user.update({
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
    } catch {
      return response.status(500).send();
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const deletedUser = await prismaClient.user.update({
        data: {
          deleted: true,
        },
        where: {
          id,
        },
      });

      return response.send({ message: 'usuário deletado com sucesso' });
    } catch {
      return response.status(500).send();
    }
  }

  async sendRecoveryPasswordEmail(request: Request, response: Response) {
    const { email, name } = request.body;

    const link = 'http://127.0.0.1:3333/user/546218/changePassword';

    const mailOptions: IMailOptions = {
      to: email,
      from: `<${process.env.SMTP_USER}>`,
      subject: 'Recuperação de Senha',
      text: `Olá ${name}, você solicitou alteração de senha\nAltere em: ${link}`,
      template: 'recovery_password',
      context: {
        subject: 'Recuperação de Senha',
        name,
        link,
      },
    };

    await transporter.sendMail(mailOptions).catch((error) => {
      if (error) {
        return response
          .status(500)
          .send({ message: 'Erro ao enviar email', error });
      }
    });

    return response.send();
  }

  async recoveryPassword(request: Request, response: Response) {
    const { id } = request.params;
    const { password } = request.body;

    try {
      const user = prismaClient.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return response.status(404).send({ message: 'Usuário não encontrado' });
      }

      const salt = genSaltSync(10);
      const hashedPassword = hashSync(password, salt);

      const updatedUser = await prismaClient.user.update({
        data: {
          password: hashedPassword,
        },
        where: {
          id,
        },
      });

      return response.send({ message: 'Senha Alterada com sucesso' });
    } catch {
      return response.status(500).send();
    }
  }

  async projects(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: id as string,
        },
        include: {
          Projects: {
            include: {
              project: true,
            },
          },
        },
      });

      if (!user) {
        return response.status(404).send({ message: 'Usuário não encontrado' });
      }

      const projects = user.Projects;

      return response.send(projects);
    } catch {
      return response.status(500).send();
    }
  }

  async requests(request: Request, response: Response) {
    const requests = await prismaClient.registrationRequest.findMany();

    return response.send(requests);
  }

  async teachers(request: Request, response: Response) {
    try {
      const users = await prismaClient.user.findMany({
        where: {
          deleted: false,
          role: 'Teacher',
        },
      });

      return response.send(
        users.map((user) => {
          return {
            name: user.name,
            last_name: user.last_name,
            id: user.id,
          };
        })
      );
    } catch (error) {
      console.log(error);
      return response.status(500).send();
    }
  }
}

export { UserController };
