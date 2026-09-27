import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Maximize2 } from 'lucide-react';
import type { GalleryItem } from '../../types';

import { LightboxModal } from '../ui/LightboxModal';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filters = [
    { name: 'All Photos', slug: 'all' },
    { name: 'Food', slug: 'food' },
    { name: 'Interior', slug: 'interior' },
    { name: 'Chef & Kitchen', slug: 'chef' },
    { name: 'Ambiance', slug: 'ambiance' },
  ];

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="gallery" className="py-24 bg-obsidian-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-widest">
            <Camera className="w-3.5 h-3.5" />
            <span>Atmosphere & Culinary Gallery</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100">
            A Visual Journey
          </h2>
          <p className="text-cream-300 text-sm sm:text-base font-light">
            Immerse yourself in the dark elegance, fiery craft, and editorial atmosphere of L'Étoile Noir.
          </p>
        </div>

        {/* Gallery Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {filters.map((f) => {
            const isActive = activeFilter === f.slug;
            return (
              <button
                key={f.slug}
                onClick={() => setActiveFilter(f.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-champagne-500 text-obsidian-950 shadow-gold-subtle'
                    : 'bg-obsidian-900 border border-obsidian-800 text-cream-300 hover:text-cream-100 hover:border-obsidian-700'
                }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>

        {/* Masonry / Grid Display */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[260px]">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedItem(item)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-obsidian-750 bg-obsidian-900 shadow-dark-card ${
                  item.spanClass || 'col-span-1 row-span-1'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Overlaid details on hover */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-obsidian-950/70 border border-obsidian-700 text-cream-200 group-hover:text-champagne-400 group-hover:scale-110 transition-all duration-300">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-400">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-cream-100">{item.title}</h3>
                    {item.caption && (
                      <p className="text-xs text-cream-300 font-light line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
};
