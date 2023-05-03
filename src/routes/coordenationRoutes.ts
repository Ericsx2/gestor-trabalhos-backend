import { Router } from 'express';
import { CoordenationController } from '../controllers/CoordenationController';
import authMiddleware from '../middlewares/authMiddleware';

const coordenationRouter = Router();
const coordenationController = new CoordenationController();

coordenationRouter.get('/', authMiddleware, coordenationController.index);
coordenationRouter.post('/', coordenationController.store);
coordenationRouter.get('/:id', authMiddleware, coordenationController.show);
coordenationRouter.put('/:id', authMiddleware, coordenationController.update);
coordenationRouter.delete(
  '/:id',
  authMiddleware,
  coordenationController.delete
);

export { coordenationRouter };
