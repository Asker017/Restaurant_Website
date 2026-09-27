import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Calendar, Clock, Users, Phone, Ticket } from 'lucide-react';

import type { ReservationResponse } from '../../types';


interface ReservationConfirmationModalProps {
  data: ReservationResponse['data'] | null;
  onClose: () => void;
}

export const ReservationConfirmationModal: React.FC<ReservationConfirmationModalProps> = ({
  data,
  onClose,
}) => {
  if (!data) return null;

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
            Reservation Confirmed
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mt-1 mb-2">
            We Look Forward To Welcoming You
          </h3>

          <p className="text-xs text-cream-300 font-light mb-6">
            A confirmation email has been sent to <span className="text-champagne-400 font-medium">{data.email}</span>.
          </p>

          {/* Printable Ticket Card */}
          <div className="bg-obsidian-950/90 border border-obsidian-800 rounded-2xl p-5 text-left space-y-4 mb-6 relative">
            <div className="flex items-center justify-between border-b border-obsidian-850 pb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-cream-400">Booking Reference</div>
                <div className="font-mono text-lg font-bold text-champagne-400 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4" /> {data.bookingCode}
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-champagne-500" />
                <div>
                  <div className="text-cream-400 text-[10px]">Date</div>
                  <div className="text-cream-100 font-medium">{data.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-champagne-500" />
                <div>
                  <div className="text-cream-400 text-[10px]">Time</div>
                  <div className="text-cream-100 font-medium">{data.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-champagne-500" />
                <div>
                  <div className="text-cream-400 text-[10px]">Guests</div>
                  <div className="text-cream-100 font-medium">{data.guests} Guests</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-champagne-500" />
                <div>
                  <div className="text-cream-400 text-[10px]">Guest Name</div>
                  <div className="text-cream-100 font-medium">{data.name}</div>
                </div>
              </div>
            </div>

            {data.specialRequests && (
              <div className="pt-3 border-t border-obsidian-850 text-xs">
                <span className="text-cream-400 text-[10px] block">Special Requests</span>
                <span className="text-cream-300 italic">"{data.specialRequests}"</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle transition-colors"
          >
            Done
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
