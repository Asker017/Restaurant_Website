import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../types';


export interface IReviewDocument extends Omit<IReview, '_id'>, Document {}

const ReviewSchema: Schema = new Schema<IReviewDocument>({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, default: 'Verified Guest' },
  date: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  customer: { type: Schema.Types.ObjectId, ref: 'User' },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });


export const Review = mongoose.model<IReviewDocument>('Review', ReviewSchema);
