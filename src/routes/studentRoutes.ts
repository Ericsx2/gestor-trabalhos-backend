import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import authMiddleware from '../middlewares/authMiddleware';

const studentRouter = Router();
const studentController = new StudentController();

studentRouter.get('/', authMiddleware, studentController.index);
studentRouter.post('/', studentController.store);
studentRouter.get('/:id', authMiddleware, studentController.show);
studentRouter.put('/:id', authMiddleware, studentController.update);
studentRouter.delete('/:id', authMiddleware, studentController.delete);

export { studentRouter };
