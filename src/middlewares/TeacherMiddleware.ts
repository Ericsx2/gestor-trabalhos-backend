import { Request, Response, NextFunction } from 'express';

function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { role } = request.body;

  if (role !== 'Teacher') {
    return response.status(403).send({ message: 'Usuário sem permissão' });
  }

  next();
}

export default authMiddleware;
