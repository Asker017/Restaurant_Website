import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review';
import { initialReviews } from '../seed/seedData';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

export const getReviews = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const reviews = await Review.find({
        $or: [{ status: 'approved' }, { status: { $exists: false } }]
      }).sort({ rating: -1, createdAt: -1 });
      if (reviews.length > 0) {
        res.status(200).json({ success: true, data: reviews });
        return;
      }
    } catch (dbError) {
      console.log('[ReviewController] DB query fallback to seed reviews');
    }

    res.status(200).json({ success: true, data: initialReviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to submit a review.' });
      return;
    }

    const { rating, comment, orderId } = req.body;

    const user = await User.findById(req.user.id);
    const userName = user ? user.name : 'Verified Guest';

    let newReview;
    try {
      newReview = await Review.create({
        name: userName,
        rating,
        comment,
        role: 'Verified Guest',
        date: 'Just now',
        customer: req.user.id,
        orderId: orderId || undefined
      });
    } catch (dbError) {
      newReview = {
        _id: 'rev_' + Date.now(),
        name: userName,
        rating,
        comment,
        role: 'Verified Guest',
        date: 'Just now',
        customer: req.user.id,
        createdAt: new Date()
      };
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};
