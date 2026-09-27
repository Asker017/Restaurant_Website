import mongoose, { Schema, Document } from 'mongoose';
import { IReservation } from '../types';


export interface IReservationDocument extends IReservation, Document {}

const ReservationSchema: Schema = new Schema<IReservationDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 },
  specialRequests: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  bookingCode: { type: String, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


export const Reservation = mongoose.model<IReservationDocument>('Reservation', ReservationSchema);
