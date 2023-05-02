import { Router } from 'express';
import { TeacherController } from '../controllers/TeacherController';
import authMiddleware from '../middlewares/authMiddleware';

const teacherRouter = Router();
const teacherControler = new TeacherController();


teacherRouter.get('/', authMiddleware, teacherControler.index);
teacherRouter.post('/', authMiddleware, teacherControler.store);
teacherRouter.get('/:id', authMiddleware, teacherControler.show);
teacherRouter.put('/:id', authMiddleware, teacherControler.update);
teacherRouter.delete('/:id', authMiddleware, teacherControler.delete);

export { teacherRouter };