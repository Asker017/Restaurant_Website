import { Router } from 'express';
import { getMenuItems, getMenuItemById } from '../controllers/menuController';


const router = Router();

router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

export default router;
