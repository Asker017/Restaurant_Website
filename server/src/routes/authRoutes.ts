import { Router } from 'express';
import { register, login, adminLogin, getMe, updateProfile, toggleFavorite } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, registerSchema, loginSchema, updateProfileSchema } from '../middleware/validate';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/admin/login', validateRequest(loginSchema), adminLogin);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);
router.post('/favorites/:itemId', authenticateToken, toggleFavorite);

export default router;
