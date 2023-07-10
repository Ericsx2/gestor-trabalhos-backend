import { Request, Response, NextFunction } from 'express';

function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { requestRole } = request.body;

  if (requestRole !== 'Admin') {
    return response.status(403).send({ message: 'Usuário sem permissão' });
  }

  next();
}

export default authMiddleware;
