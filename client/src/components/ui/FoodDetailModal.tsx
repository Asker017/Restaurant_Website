import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, Leaf, Wheat, Clock, UtensilsCrossed, Calendar, ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import type { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onReserveItem: (dishName: string) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose, onReserveItem }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!item) return null;

  const isAvailable = item.isAvailable !== false;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(item, quantity, specialNote);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-3xl bg-obsidian-900 border border-obsidian-750 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 my-auto max-h-[88vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 hover:bg-obsidian-950 transition-colors border border-obsidian-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto max-h-[88vh]">
            {/* Image Column */}
            <div className="md:col-span-6 relative h-48 sm:h-60 md:h-auto md:min-h-[320px] shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-obsidian-900" />
              
              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {item.isChefSpecial && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-champagne-500 text-obsidian-950 text-[10px] font-bold uppercase tracking-wider shadow-gold-subtle">
                    <Sparkles className="w-3 h-3" /> Chef's Special
                  </span>
                )}
                {item.isVegetarian && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
                    <Leaf className="w-3 h-3" /> Vegetarian
                  </span>
                )}
                {item.isSpicy && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-semibold uppercase tracking-wider">
                    <Flame className="w-3 h-3" /> Spicy
                  </span>
                )}
                {item.isGlutenFree && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                    <Wheat className="w-3 h-3" /> Gluten-Free
                  </span>
                )}
              </div>

              {!isAvailable && (
                <div className="absolute inset-0 bg-obsidian-950/75 flex items-center justify-center backdrop-blur-xs">
                  <span className="px-4 py-2 rounded-full bg-rose-950 border border-rose-500/50 text-rose-300 font-bold uppercase text-xs tracking-widest">
                    Currently Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="md:col-span-6 p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-champagne-400">
                    {item.category}
                  </span>
                  <span className="font-serif text-2xl font-bold text-champagne-400">
                    ${item.price}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-cream-300 leading-relaxed font-light mb-4">
                  {item.description}
                </p>

                {/* Preparation specs */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-obsidian-800 text-xs text-cream-300 mb-4">
                  {item.preparationTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-champagne-500" />
                      <span>Prep: {item.preparationTime}</span>
                    </div>
                  )}
                  {item.calories && (
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-champagne-500" />
                      <span>Calories: {item.calories} kcal</span>
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-cream-300 mb-1.5">
                      Artisanal Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-obsidian-800 border border-obsidian-750 text-xs text-cream-300"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Instructions Input */}
                {isAvailable && (
                  <div className="mb-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream-300 mb-1">
                      Preparation Preferences / Special Notes
                    </label>
                    <input
                      type="text"
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                      placeholder="Extra truffle oil, no nuts, sauce on side..."
                      className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Action Area: Quantity Stepper & Add to Cart */}
              <div className="pt-4 border-t border-obsidian-800 space-y-3">
                {isAvailable ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                    {/* Quantity Modifier */}
                    <div className="flex items-center justify-between sm:justify-start gap-2 bg-obsidian-950 border border-obsidian-800 rounded-full px-3 py-1.5 shrink-0">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 rounded-full text-cream-300 hover:text-champagne-400 hover:bg-obsidian-800 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-cream-100 w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 rounded-full text-cream-300 hover:text-champagne-400 hover:bg-obsidian-800 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart CTA */}
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 py-3 sm:py-3.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider sm:tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                        addedSuccess
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-champagne-500 text-obsidian-950 hover:bg-champagne-400 shadow-gold-subtle transform hover:-translate-y-0.5'
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="w-4 h-4 shrink-0" />
                          <span className="truncate">Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 shrink-0" />
                          <span className="truncate">Add to Cart • ${(item.price * quantity).toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                    This dish is temporarily unavailable for online order.
                  </div>
                )}

                <button
                  onClick={() => {
                    onReserveItem(item.title);
                    onClose();
                  }}
                  className="w-full text-center py-2 text-xs font-medium text-cream-400 hover:text-champagne-400 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-champagne-500" />
                  <span>Or Reserve a Table for this Dish</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
