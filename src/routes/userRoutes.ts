import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';
const userRouter = Router();
const userController = new UserController();

userRouter.get('/', [ authMiddleware, adminAuthMiddleware], userController.index);
userRouter.post('/', userController.store);
userRouter.get('/:id', [ authMiddleware, adminAuthMiddleware], userController.show);
userRouter.put('/:id', [ authMiddleware, adminAuthMiddleware], userController.update);
userRouter.delete('/:id', [ authMiddleware, adminAuthMiddleware], userController.delete);

export { userRouter };
