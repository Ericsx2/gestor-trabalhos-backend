import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv').config();

class AuthController {
  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const user = await prismaClient.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return response
          .status(404)
          .send({ message: 'Email ou senha inválido!' });
      }

      const passwordIsValid = compareSync(password, user.password);

      if (!passwordIsValid) {
        return response
          .status(404)
          .send({ message: 'Email ou senha inválido!' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '87min' }
      );

      return response.send({ user:
        {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        token });
    } catch(error){
      return response.status(500).send(error);
    }
  }
}

export { AuthController };
