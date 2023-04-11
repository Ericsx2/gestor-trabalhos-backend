import { Router } from 'express';
import { CoordenationController } from '../controllers/CoordenationController';

const coordenationRouter = Router();
const coordenationController = new CoordenationController();

coordenationRouter.get('/', coordenationController.index);
coordenationRouter.post('/', coordenationController.store);
coordenationRouter.get('/:id', coordenationController.show);
coordenationRouter.put('/:id', coordenationController.update);
coordenationRouter.delete('/:id', coordenationController.delete);

export { coordenationRouter };
