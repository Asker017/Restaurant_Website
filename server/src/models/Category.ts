import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '../types';


export interface ICategoryDocument extends ICategory, Document {}

const CategorySchema: Schema = new Schema<ICategoryDocument>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const Category = mongoose.model<ICategoryDocument>('Category', CategorySchema);
