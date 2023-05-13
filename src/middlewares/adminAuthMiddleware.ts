import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function adminAuthMiddleware(
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

    const { id, name, email, role } = data as TokenPayload;
    
    if(role == "Admin") {
      return next();
    }else{
      return response.status(403).send('Não tem permissão!!');
    }

  } catch (err) {
    return response.status(401).send('Não tem autorização!!');
  }
}

export default adminAuthMiddleware;
