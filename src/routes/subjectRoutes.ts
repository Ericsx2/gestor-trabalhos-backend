import { Router } from 'express';
import { SubjectController } from '../controllers/SubjectsController';
import  authMiddleware  from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const subjectRouter = Router();
const subjectController = new SubjectController();

subjectRouter.get('/', [ authMiddleware, adminAuthMiddleware ], subjectController.index);
subjectRouter.post('/', [ authMiddleware, adminAuthMiddleware ], subjectController.store);
subjectRouter.get('/:id', [ authMiddleware, adminAuthMiddleware ], subjectController.show);
subjectRouter.put('/:id', [ authMiddleware, adminAuthMiddleware ],subjectController.update);
subjectRouter.delete('/:id', [ authMiddleware, adminAuthMiddleware ], subjectController.delete);

export { subjectRouter };
