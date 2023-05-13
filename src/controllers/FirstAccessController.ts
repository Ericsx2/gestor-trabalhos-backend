import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { genSaltSync, hashSync } from 'bcrypt';
import { IMailOptions, transporter } from '../modules/SendEmailModule';

class FirstAccessController {
    async store(request: Request, response: Response) {
        const { registration } = request.body;
    
        const registrationAlreadyExists = await prismaClient.registrationRequest.findUnique({
          where: {
            registration,
          },
        });
    
        if (registrationAlreadyExists) {
          return response.status(302).send({ message: 'Matrícula já existente!' });
        }
    
        const registration_requests = await prismaClient.registrationRequest.create({
          data: {
            registration,
          },
        });
    
        return response.send({ message: 'Sua solicitação foi criada com sucesso. Aguarde o email do colegiado com suas informações de primeiro acesso' });
      }
}

export { FirstAccessController };
