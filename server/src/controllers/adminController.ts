import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { Reservation } from '../models/Reservation';
import { User } from '../models/User';
import { MenuItem } from '../models/MenuItem';
import { Category } from '../models/Category';
import { Review } from '../models/Review';

// Status transition validation rules
const VALID_ORDER_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'out_for_delivery', 'cancelled'],
  ready: ['completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

// GET /api/admin/dashboard
export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Today's orders
    const todayOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    // Today's revenue (sum of non-cancelled orders today)
    const todayOrders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
      status: { $ne: 'cancelled' }
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Pending orders count
    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });

    // Active reservations (pending or confirmed)
    const activeReservationsCount = await Reservation.countDocuments({
      status: { $in: ['pending', 'confirmed'] }
    });

    // Total registered customers
    const totalCustomersCount = await User.countDocuments({ role: 'customer' });

    // Recent 5 orders for dashboard preview
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        todayOrdersCount,
        todayRevenue,
        pendingOrdersCount,
        activeReservationsCount,
        totalCustomersCount,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders
export const getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, orderType, paymentStatus, search } = req.query;

    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (orderType && orderType !== 'all') {
      filter.orderType = orderType;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { 'customerInfo.name': { $regex: q, $options: 'i' } },
        { 'customerInfo.email': { $regex: q, $options: 'i' } },
        { 'customerInfo.phone': { $regex: q, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders/:id
export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const isOrderNum = id.startsWith('#LNO-') || id.startsWith('LNO-');
    const query = isOrderNum
      ? { orderNumber: id.startsWith('#') ? id : '#' + id }
      : { _id: id };

    const order = await Order.findOne(query);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (!status) {
      res.status(400).json({ success: false, message: 'New status is required' });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Backend status transition validation
    const currentStatus = order.status;
    if (currentStatus !== status) {
      const allowedNext = VALID_ORDER_TRANSITIONS[currentStatus] || [];
      if (!allowedNext.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Cannot transition order status from '${currentStatus}' to '${status}'. Allowed transitions: ${allowedNext.join(', ') || 'None'}`
        });
        return;
      }
    }

    order.status = status;

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // Auto-set payment status to paid upon completion
    if (status === 'completed') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} status updated to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reservations
export const getAllReservations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, status } = req.query;
    const filter: any = {};

    if (date) {
      filter.date = date;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    const reservations = await Reservation.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/reservations/:id/status
export const updateReservationStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      res.status(404).json({ success: false, message: 'Reservation not found' });
      return;
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: `Reservation ${reservation.bookingCode} updated to ${status}`,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// MENU CRUD
// GET /api/admin/menu
export const getAllMenuItems = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/menu
export const createMenuItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, price, category, image, isChefSpecial, isVegetarian, isSpicy, isGlutenFree, isAvailable, ingredients, calories, preparationTime } = req.body;

    if (!title || !description || price === undefined || price < 0 || !category || !image) {
      res.status(400).json({ success: false, message: 'Missing required fields or invalid price.' });
      return;
    }

    const newItem = await MenuItem.create({
      title,
      description,
      price: Number(price),
      category: String(category).toLowerCase(),
      image,
      isChefSpecial: Boolean(isChefSpecial),
      isVegetarian: Boolean(isVegetarian),
      isSpicy: Boolean(isSpicy),
      isGlutenFree: Boolean(isGlutenFree),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map((s: string) => s.trim()) : []),
      calories: calories ? Number(calories) : undefined,
      preparationTime: preparationTime ? String(preparationTime) : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully!',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/menu/:id
export const updateMenuItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.price !== undefined && updateData.price < 0) {
      res.status(400).json({ success: false, message: 'Price cannot be negative' });
      return;
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedItem) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/menu/:id
export const deleteMenuItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// CATEGORY CRUD
// GET /api/admin/categories
export const getAllCategories = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/categories
export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, displayOrder } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCategory = await Category.create({
      name,
      slug,
      description: description || '',
      displayOrder: displayOrder ? Number(displayOrder) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/categories/:id
export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, displayOrder } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) category.description = description;
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/categories/:id
export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    // Check if menu items still reference this category slug
    const count = await MenuItem.countDocuments({ category: category.slug });
    if (count > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category '${category.name}'. There are still ${count} menu item(s) assigned to this category. Reassign or delete them first.`
      });
      return;
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Category '${category.name}' deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// REVIEW MODERATION
// GET /api/admin/reviews
export const getAllReviews = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/reviews/:id/status
export const updateReviewStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid review status value' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    review.status = status;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review status updated to ${status}`,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/reviews/:id
export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// CUSTOMERS MANAGEMENT
// GET /api/admin/customers
export const getAllCustomers = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-passwordHash').sort({ createdAt: -1 });

    // Aggregate total spending and total order counts per customer
    const customerStats = await Promise.all(
      customers.map(async (c) => {
        const orders = await Order.find({
          $or: [
            { customer: c._id },
            { 'customerInfo.email': c.email.toLowerCase() }
          ]
        });

        const totalOrders = orders.length;
        const totalSpending = orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.total || 0), 0);

        return {
          _id: String(c._id),
          name: c.name,
          email: c.email,
          phone: c.phone,
          role: c.role,
          createdAt: c.createdAt,
          totalOrders,
          totalSpending
        };
      })
    );

    res.status(200).json({
      success: true,
      count: customerStats.length,
      data: customerStats
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/customers/:id
export const getCustomerDetail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await User.findById(id).select('-passwordHash');
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const orders = await Order.find({
      $or: [
        { customer: customer._id },
        { 'customerInfo.email': customer.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    const reservations = await Reservation.find({
      $or: [
        { customer: customer._id },
        { email: customer.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const totalSpending = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        customer: {
          _id: String(customer._id),
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          role: customer.role,
          createdAt: customer.createdAt
        },
        stats: {
          totalOrders: orders.length,
          completedOrders,
          cancelledOrders,
          totalSpending
        },
        recentOrders: orders,
        reservations
      }
    });
  } catch (error) {
    next(error);
  }
};
