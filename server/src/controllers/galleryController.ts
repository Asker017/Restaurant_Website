import { Request, Response, NextFunction } from 'express';
import { GalleryItem } from '../models/GalleryItem';
import { initialGalleryItems } from '../seed/seedData';


export const getGalleryItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;
    try {
      let filter: any = {};
      if (category && category !== 'all') {
        filter.category = (category as string).toLowerCase();
      }
      const gallery = await GalleryItem.find(filter);
      if (gallery.length > 0) {
        res.status(200).json({ success: true, data: gallery });
        return;
      }
    } catch (dbError) {
      console.log('[GalleryController] DB query fallback to seed gallery items');
    }

    let items = initialGalleryItems;
    if (category && category !== 'all') {
      items = items.filter(item => item.category === (category as string).toLowerCase());
    }
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};
