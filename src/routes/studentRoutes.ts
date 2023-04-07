import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';

const studentRouter = Router();
const studentController = new StudentController();

studentRouter.get('/', studentController.index);
studentRouter.post('/', studentController.store);
studentRouter.get('/:id', studentController.show);
studentRouter.put('/:id', studentController.update);
studentRouter.delete('/:id', studentController.delete);

export { studentRouter };
