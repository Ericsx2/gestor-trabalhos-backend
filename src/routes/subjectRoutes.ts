import { Router } from 'express';
import { SubjectController } from '../controllers/SubjectsController';

const subjectRouter = Router();
const subjectController = new SubjectController();

subjectRouter.get('/', subjectController.index);
subjectRouter.post('/', subjectController.store);
subjectRouter.get('/:id', subjectController.show);
subjectRouter.put('/:id', subjectController.update);
subjectRouter.delete('/:id', subjectController.delete);

export { subjectRouter };
