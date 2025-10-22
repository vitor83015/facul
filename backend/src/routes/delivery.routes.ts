// backend/src/routes/delivery.routes.ts
import { Router } from 'express';
import {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} from '../controllers/delivery.controller';

const router = Router();

// Rotas de entregas
router.get('/', getAllDeliveries);           // Listar todas
router.get('/:id', getDeliveryById);        // Buscar por ID
router.post('/', createDelivery);           // Criar entrega
router.put('/:id', updateDelivery);         // Atualizar entrega
router.delete('/:id', deleteDelivery);      // Deletar entrega

export default router;
