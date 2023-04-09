import { Router } from 'express';
import { TeacherController } from '../controllers/TeacherController';

const teacherRouter = Router();
const teacherControler = new TeacherController();

teacherRouter.get('/', teacherControler.index);
teacherRouter.post('/', teacherControler.store);
teacherRouter.get('/:id', teacherControler.show);
teacherRouter.put('/:id', teacherControler.update);
teacherRouter.delete('/:id', teacherControler.delete);

export { teacherRouter };