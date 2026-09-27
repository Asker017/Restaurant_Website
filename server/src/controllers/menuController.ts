import { Request, Response, NextFunction } from 'express';
import { MenuItem } from '../models/MenuItem';
import { initialMenuItems } from '../seed/seedData';


export const getMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;
    let filter: any = {};
    if (category && category !== 'all') {
      filter.category = (category as string).toLowerCase();
    }

    try {
      const items = await MenuItem.find(filter).sort({ isChefSpecial: -1, createdAt: -1 });
      if (items.length > 0) {
        res.status(200).json({ success: true, data: items, count: items.length });
        return;
      }
    } catch (dbError) {
      console.log('[MenuController] DB query fallback to seed items');
    }

    // Fallback if DB is empty or offline
    let items = initialMenuItems;
    if (category && category !== 'all') {
      items = items.filter(item => item.category.toLowerCase() === (category as string).toLowerCase());
    }
    res.status(200).json({ success: true, data: items, count: items.length });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itemId = String(req.params.id);
    try {
      const item = await MenuItem.findById(itemId);
      if (item) {
        res.status(200).json({ success: true, data: item });
        return;
      }
    } catch (dbError) {
      // ignore & fallback
    }

    const fallbackItem = initialMenuItems.find((i, idx) => String(idx + 1) === itemId || i.title.toLowerCase().includes(itemId.toLowerCase()));
    if (fallbackItem) {
      res.status(200).json({ success: true, data: fallbackItem });
    } else {
      res.status(404).json({ success: false, message: 'Menu item not found' });
    }
  } catch (error) {
    next(error);
  }
};

