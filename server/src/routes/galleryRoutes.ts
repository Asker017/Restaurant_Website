import { Router } from 'express';
import { getGalleryItems } from '../controllers/galleryController';


const router = Router();

router.get('/', getGalleryItems);

export default router;
