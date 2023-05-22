import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import uploads from '../modules/UploadFileModule';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';

const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.get('/', [authMiddleware], projectController.index);
projectRouter.post(
  '/',
  [authMiddleware],
  uploads.single('project_pdf'),
  projectController.store
);
projectRouter.get('/:id', [authMiddleware], projectController.show);
projectRouter.put('/:id', [authMiddleware], projectController.update);
projectRouter.delete(
  '/:id',
  [authMiddleware, adminMiddleware],
  projectController.delete
);

projectRouter.post(
  '/approve',
  [authMiddleware, adminMiddleware],
  projectController.approve
);
projectRouter.post(
  '/reject',
  [authMiddleware, adminMiddleware],
  projectController.reject
);

export { projectRouter };
