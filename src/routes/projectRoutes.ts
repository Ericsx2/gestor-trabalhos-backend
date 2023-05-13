import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import uploads from '../controllers/uploadFiles';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';


const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.get('/', projectController.index);
projectRouter.post('/', adminAuthMiddleware, uploads.single('project_pdf'), projectController.store);
projectRouter.get('/:id', projectController.show);
projectRouter.put('/:id', authMiddleware, projectController.update);
projectRouter.delete('/:id', adminAuthMiddleware, projectController.delete);

export { projectRouter };
