import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import uploads from '../controllers/uploadFiles';

const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.get('/', projectController.index);
projectRouter.post('/', uploads.single('project_pdf'), projectController.store);
projectRouter.get('/:id', projectController.show);
projectRouter.put('/:id', projectController.update);
projectRouter.delete('/:id', projectController.delete);

export { projectRouter };
