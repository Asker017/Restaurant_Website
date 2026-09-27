import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Utensils } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, clearCart, subtotal, totalCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-md transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-screen max-w-md bg-obsidian-900 border-l border-obsidian-750 text-cream-100 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-obsidian-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-champagne-500/10 border border-champagne-500/30 flex items-center justify-center text-champagne-500 shrink-0">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-100">Your Gourmet Cart</h3>
                  <span className="text-[11px] sm:text-xs text-cream-400 font-light">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'} selected
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] sm:text-xs text-cream-400 hover:text-rose-400 transition-colors uppercase tracking-wider font-medium mr-1 whitespace-nowrap"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-1.5 sm:p-2 rounded-full bg-obsidian-850 hover:bg-obsidian-800 text-cream-200 hover:text-champagne-400 border border-obsidian-700 transition-colors shrink-0"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-obsidian-850 border border-obsidian-750 flex items-center justify-center text-cream-400">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-cream-200">Your cart is currently empty</h4>
                  <p className="text-xs text-cream-400 max-w-xs font-light">
                    Explore our seasonal menu to add Wagyu Carpaccio, Truffle Tagliolini, or artisanal reserves.
                  </p>
                  <button
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 transition-colors shadow-gold-subtle"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>View Menu</span>
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const itemId = item.menuItem._id || item.menuItem.id || item.menuItem.title;
                  return (
                    <div
                      key={itemId}
                      className="p-3.5 sm:p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800 flex gap-3 sm:gap-4 items-center shadow-inner"
                    >
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-obsidian-750 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-xs sm:text-sm font-semibold text-cream-100 truncate">
                            {item.menuItem.title}
                          </h4>
                          <span className="font-serif text-xs sm:text-sm font-bold text-champagne-400 shrink-0">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <p className="text-[10px] sm:text-[11px] text-cream-400 font-light mt-0.5">
                          ${item.menuItem.price} each
                        </p>

                        <div className="flex items-center justify-between pt-2 mt-1">
                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-obsidian-900 border border-obsidian-750 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(itemId, item.quantity - 1)}
                              className="p-1 rounded text-cream-300 hover:text-champagne-400 hover:bg-obsidian-800 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold text-cream-100 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(itemId, item.quantity + 1)}
                              className="p-1 rounded text-cream-300 hover:text-champagne-400 hover:bg-obsidian-800 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="p-1.5 rounded text-cream-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer / Checkout Actions */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 bg-obsidian-950 border-t border-obsidian-800 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-cream-300">
                    <span>Subtotal</span>
                    <span className="font-serif text-sm font-bold text-cream-100">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-cream-400 text-[11px] sm:text-xs">
                    <span>Pickup / Delivery Fee</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="pt-2 border-t border-obsidian-850 flex items-center justify-between text-xs sm:text-sm font-semibold text-cream-100">
                    <span>Estimated Subtotal</span>
                    <span className="font-serif text-base sm:text-lg text-champagne-400">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeCart();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 sm:py-4 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 whitespace-nowrap px-4"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
