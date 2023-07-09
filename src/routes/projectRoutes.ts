import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import uploads from '../modules/UploadFileModule';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import teacherMiddleware from '../middlewares/TeacherMiddleware';

const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.get('/', [authMiddleware], projectController.index);
projectRouter.post(
  '/',
  authMiddleware,
  uploads.array("project_files"),
  projectController.store
);
projectRouter.get('/:id', [authMiddleware], projectController.show);
projectRouter.put('/:id', [authMiddleware,teacherMiddleware, adminMiddleware], projectController.update);
projectRouter.delete(
  '/:id',
  [authMiddleware,teacherMiddleware, adminMiddleware],
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
