import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  role: string;
  iat: number;
  exp: number;
}

function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).send('Não tem autorização!!');
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET as string);

    const { role } = data as TokenPayload;

    request.body = { ...request.body, requestRole: role };

    return next();
  } catch (err) {
    return response.status(401).send('Não tem autorização!!');
  }
}

export default authMiddleware;
