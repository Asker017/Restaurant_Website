import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { optionalAuth, authenticateToken } from '../middleware/auth';
import { validateRequest, orderSchema } from '../middleware/validate';

const router = Router();

router.post('/', optionalAuth, validateRequest(orderSchema), createOrder);
router.get('/', authenticateToken, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);

export default router;
