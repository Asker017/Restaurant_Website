import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Clock, MapPin, Store, Ticket, ArrowRight } from 'lucide-react';
import type { Order } from '../../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian-950/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg bg-obsidian-900 border border-champagne-500/40 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl z-10 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 border border-obsidian-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-champagne-500/10 border border-champagne-500/30 flex items-center justify-center text-champagne-500 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-champagne-400">
            Order Successfully Placed
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mt-1 mb-2">
            Thank You For Ordering
          </h3>

          <p className="text-xs text-cream-300 font-light mb-6">
            Your gourmet order has been received by Executive Chef Antoine & the kitchen.
          </p>

          {/* Order Voucher Card */}
          <div className="bg-obsidian-950/90 border border-obsidian-800 rounded-2xl p-5 text-left space-y-4 mb-6 relative">
            <div className="flex items-center justify-between border-b border-obsidian-850 pb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-cream-400">Order Reference</div>
                <div className="font-mono text-lg font-bold text-champagne-400 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4" /> {order.orderNumber}
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Received
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-champagne-500 shrink-0" />
                <div>
                  <div className="text-cream-400 text-[10px]">Estimated Preparation</div>
                  <div className="text-cream-100 font-medium">{order.estimatedPrepTime || '25–35 minutes'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {order.orderType === 'delivery' ? (
                  <MapPin className="w-4 h-4 text-champagne-500 shrink-0" />
                ) : (
                  <Store className="w-4 h-4 text-champagne-500 shrink-0" />
                )}
                <div>
                  <div className="text-cream-400 text-[10px]">Method</div>
                  <div className="text-cream-100 font-medium capitalize">{order.orderType}</div>
                </div>
              </div>
            </div>

            {/* Items summary */}
            <div className="pt-3 border-t border-obsidian-850 space-y-1.5 text-xs text-cream-300 max-h-32 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-2">
                  <span className="truncate flex-1">{item.quantity}x {item.nameSnapshot}</span>
                  <span className="font-serif font-bold text-cream-100 shrink-0">${(item.priceSnapshot * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-obsidian-850 flex flex-wrap items-baseline justify-between gap-1 text-xs">
              <span className="text-cream-400 font-medium">Total Amount Due ({order.paymentMethod === 'cod' ? 'COD' : 'Pay at Restaurant'})</span>
              <span className="font-serif text-base font-bold text-champagne-400 shrink-0">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onTrackOrder(order)}
              className="flex-1 py-3.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 px-3"
            >
              <span>Track Live Order</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
