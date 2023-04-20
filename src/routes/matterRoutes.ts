import { MatterController } from '../controllers/MatterController';
import { Router } from 'express';

const matterRouter = Router();
const matterController = new MatterController();

matterRouter.get('/', matterController.index);
matterRouter.post('/', matterController.store);
matterRouter.get('/:id', matterController.show);
matterRouter.put('/:id', matterController.update);
matterRouter.delete('/:id', matterController.delete);

export { matterRouter };
