import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}


const UserSchema: Schema = new Schema<IUserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, required: true, trim: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'MenuItem' }]
}, { timestamps: true });

export const User = mongoose.model<IUserDocument>('User', UserSchema);
