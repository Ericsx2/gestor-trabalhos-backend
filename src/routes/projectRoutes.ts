import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import uploads from '../controllers/uploadFiles';
import authMiddleware from '../middlewares/authMiddleware';


const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.get('/', projectController.index);
projectRouter.post('/', authMiddleware, uploads.single('project_pdf'), projectController.store);
projectRouter.get('/:id', projectController.show);
projectRouter.put('/:id', authMiddleware, projectController.update);
projectRouter.delete('/:id', authMiddleware, projectController.delete);

export { projectRouter };
