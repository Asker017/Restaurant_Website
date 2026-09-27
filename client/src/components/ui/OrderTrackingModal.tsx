import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, ChefHat, Bike, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { getOrderByIdApi } from '../../services/api';
import type { Order } from '../../types';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order: initialOrder, onClose }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setCurrentOrder(initialOrder);
  }, [initialOrder]);

  if (!currentOrder) return null;

  const handleRefresh = async () => {
    if (!currentOrder._id && !currentOrder.orderNumber) return;
    setIsRefreshing(true);
    try {
      const targetId = currentOrder.orderNumber || currentOrder._id!;
      const res = await getOrderByIdApi(targetId);
      if (res.data) {
        setCurrentOrder(res.data);
      }
    } catch {
      // Keep existing order state
    } finally {
      setIsRefreshing(false);
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { 
      key: currentOrder.orderType === 'delivery' ? 'out_for_delivery' : 'ready', 
      label: currentOrder.orderType === 'delivery' ? 'On the Way' : 'Ready', 
      icon: currentOrder.orderType === 'delivery' ? Bike : PackageCheck 
    },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 }
  ];

  const getStepStatus = (stepKey: string) => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed'];
    const currentIndex = statusOrder.indexOf(currentOrder.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentOrder.status === 'cancelled') return 'cancelled';
    if (stepIndex <= currentIndex) return 'completed';
    return 'upcoming';
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
          className="fixed inset-0 bg-obsidian-950/85 backdrop-blur-md"
        />

        {/* Tracking Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-xl bg-obsidian-900 border border-obsidian-750 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl z-10 my-auto max-h-[88vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 border border-obsidian-700 transition-colors"
            aria-label="Close tracking modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="border-b border-obsidian-800 pb-4 mb-6 pr-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-400">
                Live Order Tracker
              </span>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 rounded-full text-cream-400 hover:text-champagne-400 transition-colors"
                title="Refresh status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 mt-0.5">
              {currentOrder.orderNumber}
            </h3>
          </div>

          {/* Cancellation Alert */}
          {currentOrder.status === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block text-sm">Order Cancelled</span>
                <span>This order was cancelled. Please contact concierge if you require assistance.</span>
              </div>
            </div>
          ) : (
            /* Visual Status Timeline Progress Bar */
            <div className="py-3 sm:py-4 mb-6 sm:mb-8">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-4 sm:top-5 left-3 right-3 sm:left-4 sm:right-4 h-0.5 bg-obsidian-800 -z-0" />
                
                {statusSteps.map((step, idx) => {
                  const status = getStepStatus(step.key);
                  const Icon = step.icon;
                  const isDone = status === 'completed';

                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center group flex-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                          isDone
                            ? 'bg-champagne-500 text-obsidian-950 border-champagne-400 shadow-gold-subtle scale-105'
                            : 'bg-obsidian-950 text-cream-400 border-obsidian-750'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className={`text-[8px] sm:text-[10px] font-semibold tracking-wider uppercase mt-1.5 sm:mt-2 text-center truncate max-w-[55px] sm:max-w-[70px] ${
                        isDone ? 'text-champagne-400' : 'text-cream-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Summary & Details */}
          <div className="bg-obsidian-950 p-4 sm:p-5 rounded-2xl border border-obsidian-800 space-y-3 sm:space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-obsidian-850">
              <div>
                <span className="text-cream-400 block text-[10px]">Estimated Preparation</span>
                <span className="font-serif text-xs sm:text-sm font-bold text-champagne-400 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" /> {currentOrder.estimatedPrepTime || '25-35 minutes'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-cream-400 block text-[10px]">Method</span>
                <span className="font-bold text-cream-100 uppercase tracking-wider text-xs sm:text-sm">
                  {currentOrder.orderType}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-2 text-cream-300">
                  <span className="truncate flex-1">{item.quantity}x {item.nameSnapshot}</span>
                  <span className="font-serif font-bold text-cream-100 shrink-0">${(item.priceSnapshot * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-obsidian-850 flex flex-wrap items-baseline justify-between gap-1 font-bold text-xs sm:text-sm text-cream-100">
              <span>Total Paid / Due</span>
              <span className="font-serif text-base sm:text-lg text-champagne-400 shrink-0">${currentOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 transition-colors shadow-gold-subtle"
            >
              Close Tracker
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
