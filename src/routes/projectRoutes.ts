import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import uploads from '../controllers/uploadFiles';
import authMiddleware from '../middlewares/authMiddleware';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';


const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.get('/', [ authMiddleware, adminAuthMiddleware ], projectController.index);
projectRouter.post('/', [ authMiddleware, adminAuthMiddleware ], uploads.single('project_pdf'), projectController.store);
projectRouter.get('/:id', [ authMiddleware, adminAuthMiddleware ], projectController.show);
projectRouter.put('/:id', [ authMiddleware, adminAuthMiddleware ], projectController.update);
projectRouter.delete('/:id', [ authMiddleware, adminAuthMiddleware ], projectController.delete);

export { projectRouter };
