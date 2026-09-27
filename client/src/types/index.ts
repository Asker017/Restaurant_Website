export interface MenuItem {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isChefSpecial?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  ingredients?: string[];
  calories?: number;
  preparationTime?: string;
}

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

export interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  role?: string;
  date?: string;
  status?: 'pending' | 'approved' | 'rejected';
  customer?: string;
  orderId?: string;
}

export interface GalleryItem {
  _id?: string;
  title: string;
  category: 'food' | 'interior' | 'chef' | 'ambiance' | 'drinks';
  imageUrl: string;
  caption?: string;
  spanClass?: string;
}

export interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export interface Reservation {
  _id?: string;
  bookingCode: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  data: Reservation;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  favorites?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface OrderItemPayload {
  menuItem: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  specialInstructions?: string;
}

export interface DeliveryAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  customer?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    menuItem: string | MenuItem;
    nameSnapshot: string;
    priceSnapshot: number;
    quantity: number;
    specialInstructions?: string;
  }[];
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: DeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'pay_at_restaurant';
  estimatedPrepTime?: string;
  createdAt?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: User;
}

export interface AdminDashboardStats {
  todayOrdersCount: number;
  todayRevenue: number;
  pendingOrdersCount: number;
  activeReservationsCount: number;
  totalCustomersCount: number;
  recentOrders: Order[];
}

export interface AdminCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  totalOrders: number;
  totalSpending: number;
}

export interface AdminCustomerDetail {
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
  };
  stats: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSpending: number;
  };
  recentOrders: Order[];
  reservations: Reservation[];
}
