import { Router } from 'express';
import { FirstAccessController } from '../controllers/FirstAccessController';


const firstAccessRouter = Router();
const firstAccessController = new FirstAccessController();

firstAccessRouter.post('/', firstAccessController.store);

export { firstAccessRouter };
