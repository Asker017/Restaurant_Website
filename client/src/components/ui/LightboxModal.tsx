import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import type { GalleryItem } from '../../types';


interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian-950/90 backdrop-blur-lg"
        />

        {/* Lightbox Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative max-w-5xl w-full bg-obsidian-900 rounded-2xl overflow-hidden border border-obsidian-750 z-10 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 hover:bg-obsidian-950 transition-colors border border-obsidian-700"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative max-h-[75vh] flex items-center justify-center bg-obsidian-950">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full max-h-[75vh] object-contain"
            />
          </div>

          <div className="p-6 bg-obsidian-900 border-t border-obsidian-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-4 h-4 text-champagne-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-champagne-400">
                  {item.category}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-cream-100">{item.title}</h3>
              {item.caption && (
                <p className="text-xs text-cream-300 font-light mt-1">{item.caption}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
