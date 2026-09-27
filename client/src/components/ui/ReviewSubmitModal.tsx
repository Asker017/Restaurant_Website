import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createReviewApi } from '../../services/api';
import type { Order } from '../../types';

interface ReviewSubmitModalProps {
  order: Order | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewSubmitModal: React.FC<ReviewSubmitModalProps> = ({
  order,
  onClose,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (comment.trim().length < 5) {
      setErrorMsg('Please enter a review comment (min 5 characters)');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await createReviewApi(
        {
          rating,
          comment,
          orderId: order._id || order.orderNumber,
        },
        token
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review');
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
          className="relative w-full max-w-md bg-obsidian-900 border border-obsidian-750 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 border border-obsidian-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-champagne-400">
              Order Feedback
            </span>
            <h3 className="font-serif text-2xl font-bold text-cream-100 mt-1">
              Rate Your Experience
            </h3>
            <p className="text-xs text-cream-300 font-light mt-1">
              Reviewing Order <span className="font-mono text-champagne-400 font-semibold">{order.orderNumber}</span>
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating Picker */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-cream-200">
                Your Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-champagne-500 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-champagne-500 text-champagne-500' : 'text-obsidian-750'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-champagne-500" />
                <span>Your Review & Comments</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on flavor, presentation, and delivery service..."
                className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none resize-none placeholder:text-cream-400/60"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Verified Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
