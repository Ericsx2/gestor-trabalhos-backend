import { Router } from 'express';
import { SubjectController } from '../controllers/SubjectsController';
import  authMiddleware  from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const subjectRouter = Router();
const subjectController = new SubjectController();

subjectRouter.get('/', subjectController.index);
subjectRouter.post('/', adminAuthMiddleware, subjectController.store);
subjectRouter.get('/:id', subjectController.show);
subjectRouter.put('/:id', adminAuthMiddleware,subjectController.update);
subjectRouter.delete('/:id', adminAuthMiddleware, subjectController.delete);

export { subjectRouter };
