import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

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
