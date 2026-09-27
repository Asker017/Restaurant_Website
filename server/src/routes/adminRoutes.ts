import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  getDashboardStats,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllReservations,
  updateReservationStatus,
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
  getAllCustomers,
  getCustomerDetail
} from '../controllers/adminController';

const router = Router();

// Protect ALL admin routes with token authentication & admin authorization
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Orders Management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);

// Reservations Management
router.get('/reservations', getAllReservations);
router.patch('/reservations/:id/status', updateReservationStatus);

// Menu Management
router.get('/menu', getAllMenuItems);
router.post('/menu', createMenuItem);
router.patch('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Categories Management
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Review Moderation
router.get('/reviews', getAllReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

// Customer Management
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerDetail);

export default router;
