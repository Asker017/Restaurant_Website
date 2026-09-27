import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const reservationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  date: z.string().min(1, 'Reservation date is required'),
  time: z.string().min(1, 'Reservation time is required'),
  guests: z.number().int().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests per online booking'),
  specialRequests: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
});

export const orderItemSchema = z.object({
  menuItem: z.string().min(1, 'Menu item ID required'),
  nameSnapshot: z.string().min(1, 'Item name snapshot required'),
  priceSnapshot: z.number().min(0, 'Price must be non-negative'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  specialInstructions: z.string().optional(),
});

export const orderSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(2, 'Customer name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(7, 'Valid phone number is required'),
  }),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  orderType: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.object({
    street: z.string().min(3, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(3, 'Zip code is required'),
  }).optional(),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
  orderId: z.string().optional(),
});

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};
