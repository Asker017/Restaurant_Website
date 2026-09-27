import mongoose, { Schema, Document } from 'mongoose';
import { IMenuItem } from '../types';


export interface IMenuItemDocument extends IMenuItem, Document {}

const MenuItemSchema: Schema = new Schema<IMenuItemDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  image: { type: String, required: true },
  isChefSpecial: { type: Boolean, default: false },
  isVegetarian: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  ingredients: [{ type: String }],

  calories: { type: Number },
  preparationTime: { type: String }
}, { timestamps: true });

export const MenuItem = mongoose.model<IMenuItemDocument>('MenuItem', MenuItemSchema);
