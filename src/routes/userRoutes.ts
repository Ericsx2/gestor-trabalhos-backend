import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', [authMiddleware, adminMiddleware], userController.index);
userRouter.post('/', [authMiddleware, adminMiddleware], userController.store);
userRouter.get('/:id', authMiddleware, userController.show);
userRouter.put('/:id', authMiddleware, userController.update);
userRouter.delete('/:id',[authMiddleware, adminMiddleware], userController.delete);
userRouter.post(
  '/recovery_email',
  authMiddleware,
  userController.sendRecoveryPasswordEmail
);
userRouter.post(
  '/recovery_password',
  authMiddleware,
  userController.recoveryPassword
);

export { userRouter };
