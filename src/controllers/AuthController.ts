import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
    async auth(request: Request, response: Response) {
        const { email, password } = request.body;

        const user = await prismaClient.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            return response.status(404).send({ message: "Email ou senha inválido!" });
        }

        const passwordIsValid = compareSync(password, user.password);

        if (!passwordIsValid) {
            return response.status(404).send({ message: "Email ou senha inválido!" });
        }

        const token = jwt.sign({
            id: user.id,
            role: user.role,
            email: user.email
        },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' });

        return response.send({ token });
    }
}

export { AuthController };