import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Leaf, Wheat, Eye, Heart, ShoppingBag, Check } from 'lucide-react';
import type { MenuItem, Category } from '../../types';
import { FoodCategories } from './FoodCategories';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface MenuSectionProps {
  categories: Category[];
  items: MenuItem[];
  isLoading?: boolean;
  onSelectItem: (item: MenuItem) => void;
  onRequireAuth?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  items,
  isLoading = false,
  onSelectItem,
  onRequireAuth,
}) => {

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const { addToCart } = useCart();
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth();

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (item.isAvailable === false) return;
    const itemId = item._id || item.id || item.title;
    addToCart(item, 1);
    setAddedItemMap((prev) => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [itemId]: false }));
    }, 1200);
  };

  const handleToggleFav = async (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    const itemId = item._id || item.id || item.title;
    try {
      await toggleFavorite(itemId);
    } catch {
      // ignore
    }
  };

  return (
    <section id="menu" className="py-24 bg-obsidian-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-champagne-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seasonal Gastronomy</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100">
            Our Culinary Menu
          </h2>
          <p className="text-cream-300 text-sm sm:text-base font-light">
            Every dish is an orchestration of rare ingredients, wild botanicals, and precise culinary technique.
          </p>
        </div>

        {/* Category Navigation Filter */}
        <FoodCategories
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="h-96 rounded-2xl bg-obsidian-900/50 animate-pulse border border-obsidian-800" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const itemId = item._id || item.id || item.title;
                const isFav = isFavorite(itemId);
                const isAdded = !!addedItemMap[itemId];
                const isAvailable = item.isAvailable !== false;

                return (
                  <motion.div
                    key={itemId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group relative rounded-2xl bg-obsidian-900 border border-obsidian-750 hover:border-champagne-500/50 overflow-hidden shadow-dark-card transition-all duration-500 flex flex-col justify-between"
                  >
                    {/* Card Image */}
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/10 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        {item.isChefSpecial && (
                          <span className="px-2.5 py-0.5 rounded-full bg-champagne-500 text-obsidian-950 text-[10px] font-bold uppercase tracking-wider shadow-gold-subtle flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Special
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="p-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs" title="Vegetarian">
                            <Leaf className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="p-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs" title="Spicy">
                            <Flame className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="p-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs" title="Gluten-Free">
                            <Wheat className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      {/* Favorite Button (Top Right) */}
                      <button
                        onClick={(e) => handleToggleFav(e, item)}
                        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 z-10 ${
                          isFav
                            ? 'bg-rose-950/80 border-rose-500/50 text-rose-400 scale-110'
                            : 'bg-obsidian-950/70 border-obsidian-750 text-cream-300 hover:text-rose-400 hover:scale-110'
                        }`}
                        title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                        aria-label="Toggle Favorite"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>

                      {!isAvailable && (
                        <div className="absolute inset-0 bg-obsidian-950/75 flex items-center justify-center z-10">
                          <span className="px-3 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                            Sold Out
                          </span>
                        </div>
                      )}

                      {/* Quick View Button on Hover */}
                      <button
                        onClick={() => onSelectItem(item)}
                        className="absolute bottom-3 right-3 p-2.5 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 border border-obsidian-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10"
                        aria-label="View food details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-1.5">
                          <h3 
                            onClick={() => onSelectItem(item)}
                            className="font-serif text-xl font-bold text-cream-100 group-hover:text-champagne-400 transition-colors cursor-pointer"
                          >
                            {item.title}
                          </h3>
                          <span className="font-serif text-xl font-bold text-champagne-400 shrink-0">
                            ${item.price}
                          </span>
                        </div>

                        <p className="text-xs text-cream-300 font-light line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-obsidian-800/80 flex items-center justify-between text-xs">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="text-cream-300 hover:text-champagne-400 font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <span>Details</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleQuickAdd(e, item)}
                            disabled={!isAvailable}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 border flex items-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : isAvailable
                                ? 'bg-champagne-500 border-champagne-500 text-obsidian-950 hover:bg-champagne-400'
                                : 'bg-obsidian-850 border-obsidian-750 text-cream-400 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};
