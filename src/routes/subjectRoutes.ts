import { Router } from 'express';
import { SubjectController } from '../controllers/SubjectsController';
import  authMiddleware  from '../middlewares/authMiddleware';

const subjectRouter = Router();
const subjectController = new SubjectController();

subjectRouter.get('/', subjectController.index);
subjectRouter.post('/', authMiddleware, subjectController.store);
subjectRouter.get('/:id', subjectController.show);
subjectRouter.put('/:id', authMiddleware,subjectController.update);
subjectRouter.delete('/:id', authMiddleware, subjectController.delete);

export { subjectRouter };
