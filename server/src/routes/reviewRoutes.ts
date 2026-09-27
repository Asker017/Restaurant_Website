import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, reviewSchema } from '../middleware/validate';

const router = Router();

router.get('/', getReviews);
router.post('/', authenticateToken, validateRequest(reviewSchema), createReview);

export default router;
