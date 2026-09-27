import { Types } from 'mongoose';

export interface IMenuItem {
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

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

export interface IReview {
  _id?: Types.ObjectId | string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  role?: string;
  date?: string;
  status?: 'pending' | 'approved' | 'rejected';
  customer?: Types.ObjectId | string;
  orderId?: Types.ObjectId | string;
  createdAt?: Date;
}

export interface IGalleryItem {
  title: string;
  category: 'food' | 'interior' | 'chef' | 'ambiance' | 'drinks';
  imageUrl: string;
  caption?: string;
  spanClass?: string;
}

export interface IReservation {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingCode?: string;
  customer?: Types.ObjectId | string;
  createdAt?: Date;
}

export interface IUser {
  _id?: Types.ObjectId | string;
  name: string;
  email: string;
  passwordHash?: string;
  phone: string;
  role: 'customer' | 'admin';
  favorites?: (Types.ObjectId | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderItem {
  menuItem: Types.ObjectId | string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  specialInstructions?: string;
}

export interface IDeliveryAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface IOrder {
  _id?: Types.ObjectId | string;
  orderNumber: string;
  customer?: Types.ObjectId | string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: IDeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'pay_at_restaurant';
  estimatedPrepTime?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}
