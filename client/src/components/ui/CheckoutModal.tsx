import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, MapPin, Store, User, Mail, Phone, CreditCard, Loader2, FileText } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrderApi } from '../../services/api';
import type { Order } from '../../types';

const checkoutSchema = z.object({
  orderType: z.enum(['pickup', 'delivery']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.orderType === 'delivery') {
    if (!data.street || data.street.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Street address is required for delivery',
        path: ['street'],
      });
    }
    if (!data.city || data.city.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'City is required for delivery',
        path: ['city'],
      });
    }
    if (!data.zipCode || data.zipCode.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Zip code is required for delivery',
        path: ['zipCode'],
      });
    }
  }
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { items, subtotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: 'delivery',
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: '',
      city: 'New York',
      state: 'NY',
      zipCode: '10017',
      notes: '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone);
    }
  }, [user, setValue]);

  const selectedOrderType = watch('orderType');
  const deliveryFee = selectedOrderType === 'delivery' ? 5.00 : 0.00;
  const finalTotal = subtotal + deliveryFee;

  if (!isOpen) return null;

  const onSubmit = async (values: CheckoutValues) => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      customerInfo: {
        name: values.name,
        email: values.email,
        phone: values.phone,
      },
      items: items.map((ci) => ({
        menuItem: ci.menuItem._id || ci.menuItem.id || ci.menuItem.title,
        nameSnapshot: ci.menuItem.title,
        priceSnapshot: ci.menuItem.price,
        quantity: ci.quantity,
        specialInstructions: ci.specialInstructions || '',
      })),
      orderType: values.orderType,
      deliveryAddress: values.orderType === 'delivery' ? {
        street: values.street,
        city: values.city,
        state: values.state || 'NY',
        zipCode: values.zipCode,
      } : undefined,
      notes: values.notes,
    };

    try {
      const res = await createOrderApi(payload, token || undefined);
      if (res.success && res.data) {
        clearCart();
        onOrderSuccess(res.data);
        onClose();
      } else {
        setServerError(res.message || 'Failed to place order');
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl bg-obsidian-900 border border-obsidian-750 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl z-10 my-auto max-h-[88vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 border border-obsidian-700 transition-colors"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-champagne-400">
              Checkout & Payment
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mt-1">
              Finalize Your Gourmet Order
            </h3>
          </div>

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Order Type Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-3">
                1. Select Fulfillment Method
              </label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setValue('orderType', 'delivery')}
                  className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                    selectedOrderType === 'delivery'
                      ? 'bg-obsidian-850 border-champagne-500 text-champagne-400 shadow-gold-subtle'
                      : 'bg-obsidian-950 border-obsidian-800 text-cream-300 hover:border-obsidian-700'
                  }`}
                >
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <div>
                    <div className="font-serif text-xs sm:text-sm font-bold text-cream-100">Delivery</div>
                    <div className="text-[10px] sm:text-[11px] text-cream-400">Delivered to your location ($5.00)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('orderType', 'pickup')}
                  className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                    selectedOrderType === 'pickup'
                      ? 'bg-obsidian-850 border-champagne-500 text-champagne-400 shadow-gold-subtle'
                      : 'bg-obsidian-950 border-obsidian-800 text-cream-300 hover:border-obsidian-700'
                  }`}
                >
                  <Store className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <div>
                    <div className="font-serif text-xs sm:text-sm font-bold text-cream-100">Pickup</div>
                    <div className="text-[10px] sm:text-[11px] text-cream-400">Collect at 425 Madison Ave (Free)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Customer Contact Information */}
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200">
                2. Contact Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...register('name')}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="Email"
                      {...register('email')}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      {...register('phone')}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Step 3: Delivery Address (if Delivery) */}
            {selectedOrderType === 'delivery' && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200">
                  3. Delivery Address
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="Street Address"
                    {...register('street')}
                    className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none"
                  />
                  {errors.street && <p className="text-[11px] text-rose-400 mt-1">{errors.street.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      {...register('city')}
                      className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none"
                    />
                    {errors.city && <p className="text-[11px] text-rose-400 mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State"
                      {...register('state')}
                      className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Zip Code"
                      {...register('zipCode')}
                      className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none"
                    />
                    {errors.zipCode && <p className="text-[11px] text-rose-400 mt-1">{errors.zipCode.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Special Notes & Payment Option */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-champagne-500 shrink-0" />
                  <span>Order Notes / Instructions</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Gate code, dietary notes, cutleries..."
                  {...register('notes')}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-xs focus:border-champagne-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-champagne-500 shrink-0" />
                  <span>Payment Method</span>
                </label>
                <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs text-cream-200 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-champagne-500 shrink-0" />
                  <span>{selectedOrderType === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay at Restaurant'}</span>
                </div>
              </div>
            </div>

            {/* Order Summary & Pricing Box */}
            <div className="bg-obsidian-950 p-3.5 sm:p-4 rounded-2xl border border-obsidian-800 space-y-2 text-xs">
              <div className="flex justify-between text-cream-400">
                <span>Items ({items.length})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cream-400">
                <span>Fulfillment ({selectedOrderType})</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-obsidian-850 flex flex-wrap items-baseline justify-between gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-cream-100">
                <span>Total Amount Due</span>
                <span className="font-serif text-base sm:text-lg text-champagne-400 shrink-0">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Order Action */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-3.5 sm:py-4 px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span className="truncate">Placing Order...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="truncate">Confirm & Place Order (${finalTotal.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
