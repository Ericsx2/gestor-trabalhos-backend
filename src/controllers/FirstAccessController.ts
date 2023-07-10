import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { IMailOptions, transporter } from '../modules/SendEmailModule';

class FirstAccessController {
  async store(request: Request, response: Response) {
    const { registration } = request.body;
    try {
      const registrationAlreadyExists =
        await prismaClient.registrationRequest.findUnique({
          where: {
            registration,
          },
        });

      if (registrationAlreadyExists) {
        return response
          .status(302)
          .send({ message: 'Você já fez a solicitação! Aguarde o email do colegiado com suas informações de primeiro acesso.' });
      }

      const registration_requests =
        await prismaClient.registrationRequest.create({
          data: {
            registration,
          },
        });

        const allEmailsAdmins = await prismaClient.user.findMany({
          select: {
            email: true
          },
          where: {
            role: 'Admin',
          },
        });

        const mailOptions: IMailOptions = {
          to: allEmailsAdmins.map(item => item.email),
          from: `${process.env.SMTP_USER}`,
          template: 'request_access',
          text: `Um usuário solicitou o cadastro na plataforma`,
          subject: 'Requisição de Cadastro',
          context: {
            subject:'Requisição de Cadastro'
          }
        };
  
        await transporter.sendMail(mailOptions).catch((error) => {
          if (error) {
            return response
              .status(500)
              .send({ message: 'Erro ao enviar email', error });
          }
        });

      return response.send({
        message:
          'Sua solicitação foi criada com sucesso. Aguarde o email do colegiado com suas informações de primeiro acesso',
      });
    } catch {
      return response.status(500).send();
    }
  }
}

export { FirstAccessController };
