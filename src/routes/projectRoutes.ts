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
  [authMiddleware],
  uploads.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'project_file', maxCount: 1 },
  ]),
  projectController.store
);
projectRouter.get('/show/:id', [authMiddleware], projectController.show);
projectRouter.put(
  '/:id',
  [authMiddleware, teacherMiddleware, adminMiddleware],
  projectController.update
);
projectRouter.delete(
  '/:id',
  [authMiddleware, teacherMiddleware, adminMiddleware],
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

projectRouter.get('/public/search', projectController.search);
projectRouter.get('/public/show/:id', projectController.publicShow);
projectRouter.get('/public/recents', projectController.recents);

export { projectRouter };
