import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { initialCategories } from '../seed/seedData';


export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const categories = await Category.find().sort({ displayOrder: 1 });
      if (categories.length > 0) {
        res.status(200).json({ success: true, data: categories });
        return;
      }
    } catch (dbError) {
      console.log('[CategoryController] DB query fallback to seed categories');
    }

    res.status(200).json({ success: true, data: initialCategories });
  } catch (error) {
    next(error);
  }
};
