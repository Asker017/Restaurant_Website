import React from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../../types';


interface FoodCategoriesProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const FoodCategories: React.FC<FoodCategoriesProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full flex items-center justify-start sm:justify-center my-6 overflow-x-auto py-2 px-2 sm:px-4 no-scrollbar">
      <div className="flex items-center gap-1.5 sm:gap-3 p-1.5 rounded-full bg-obsidian-900 border border-obsidian-800 shadow-inner shrink-0">
        {categories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap ${
                isActive ? 'text-obsidian-950' : 'text-cream-300 hover:text-cream-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 rounded-full bg-champagne-500 shadow-gold-subtle"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
