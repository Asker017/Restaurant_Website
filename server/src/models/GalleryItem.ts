import mongoose, { Schema, Document } from 'mongoose';
import { IGalleryItem } from '../types';


export interface IGalleryItemDocument extends IGalleryItem, Document {}

const GalleryItemSchema: Schema = new Schema<IGalleryItemDocument>({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['food', 'interior', 'chef', 'ambiance', 'drinks'],
    index: true 
  },
  imageUrl: { type: String, required: true },
  caption: { type: String },
  spanClass: { type: String }
}, { timestamps: true });

export const GalleryItem = mongoose.model<IGalleryItemDocument>('GalleryItem', GalleryItemSchema);
