import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', adminAuthMiddleware, userController.index);
userRouter.post('/', userController.store);
userRouter.get('/:id', authMiddleware, userController.show);
userRouter.put('/:id', authMiddleware, userController.update);
userRouter.delete('/:id', adminAuthMiddleware, userController.delete);

export { userRouter };
