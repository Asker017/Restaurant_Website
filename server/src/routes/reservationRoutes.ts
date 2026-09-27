import { Router } from 'express';
import { createReservation, getMyReservations } from '../controllers/reservationController';
import { validateRequest, reservationSchema } from '../middleware/validate';
import { optionalAuth, authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, validateRequest(reservationSchema), createReservation);
router.get('/my-reservations', authenticateToken, getMyReservations);

export default router;
