import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router();
const authControler = new AuthController();

authRouter.post('/', authControler.auth);

export { authRouter };