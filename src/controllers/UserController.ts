import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { genSaltSync, hashSync } from 'bcrypt';
import { IMailOptions, transporter } from '../modules/SendEmailModule';

class UserController {
  async index(_: Request, response: Response) {
    const users = await prismaClient.user.findMany({
      where: {
        deleted: false,
      },
    });

    return response.send(users);
  }

  async store(request: Request, response: Response) {
    const { name, last_name, registration, email } = request.body;

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
      return response.status(302).send({ message: 'Matrícula já existente!' });
    }

    const registrationRequestUpdated = await prismaClient.registrationRequest.update({
      data: {
        was_created: true
      },
      where: {
        registration
      }
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
      },
    });

    const mailOptions: IMailOptions = {
      to: email,
      from: `COLCIC <${process.env.SMTP_USER}>`,
      subject: 'Primeiro Acesso',
      text: `Olá ${name}, essa é a sua senha temporária ${generatedPassword}, para alterar entre no link`,
      template: 'first_access',
      context: {
        subject: 'Primeiro Acesso',
        name,
        link: 'https://www.google.com',
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
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
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
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, last_name, registration, email } = request.body;

    const user = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return response.status(404).send({ message: 'Usuário não encontrado' });
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
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deletedUser = await prismaClient.user.update({
      data: {
        deleted: true,
      },
      where: {
        id,
      },
    });

    return response.send({ message: 'usuário deletado com sucesso' });
  }

  async sendRecoveryPasswordEmail(request: Request, response: Response) {
    const { email, name } = request.body;

    const mailOptions: IMailOptions = {
      to: email,
      from: `<${process.env.SMTP_USER}>`,
      subject: 'Recuperação de Senha',
      text: `Olá ${name}, Segue abaixo o link para recuperação de senha`,
      template: 'recovery_password',
      context: {
        subject: 'Primeiro Acesso',
        name,
        link: 'https://www.google.com',
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
  }
}

export { UserController };
