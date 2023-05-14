import { Router } from 'express';
import { SubjectController } from '../controllers/SubjectsController';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';

const subjectRouter = Router();
const subjectController = new SubjectController();

subjectRouter.get('/', [authMiddleware], subjectController.index);
subjectRouter.post(
  '/',
  [authMiddleware, adminMiddleware],
  subjectController.store
);
subjectRouter.get(
  '/:id',
  [authMiddleware, adminMiddleware],
  subjectController.show
);
subjectRouter.put(
  '/:id',
  [authMiddleware, adminMiddleware],
  subjectController.update
);
subjectRouter.delete(
  '/:id',
  [authMiddleware, adminMiddleware],
  subjectController.delete
);

export { subjectRouter };
