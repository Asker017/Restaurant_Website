import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../types';

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}


const OrderItemSchema = new Schema({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  nameSnapshot: { type: String, required: true },
  priceSnapshot: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  specialInstructions: { type: String, default: '' }
}, { _id: false });

const OrderSchema: Schema = new Schema<IOrderDocument>({
  orderNumber: { type: String, required: true, unique: true, index: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User' },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [OrderItemSchema],
  orderType: { type: String, enum: ['pickup', 'delivery'], required: true },
  deliveryAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'pay_at_restaurant'],
    default: 'cod'
  },
  estimatedPrepTime: { type: String, default: '25–35 minutes' }
}, { timestamps: true });

export const Order = mongoose.model<IOrderDocument>('Order', OrderSchema);
