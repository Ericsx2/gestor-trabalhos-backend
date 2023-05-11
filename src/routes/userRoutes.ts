import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import authMiddleware from '../middlewares/authMiddleware';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', userController.index);
userRouter.post('/', userController.store);
userRouter.get('/:id', authMiddleware, userController.show);
userRouter.put('/:id', authMiddleware, userController.update);
userRouter.delete('/:id', authMiddleware, userController.delete);

export { userRouter };
