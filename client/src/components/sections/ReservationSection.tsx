import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, User, Mail, Phone, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { submitReservation } from '../../services/api';
import type { ReservationResponse } from '../../types';

import { ReservationConfirmationModal } from '../ui/ReservationConfirmationModal';

const reservationSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  guests: z.number().int().min(1, 'At least 1 guest required').max(10, 'Max 10 guests per online booking'),
  specialRequests: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface ReservationSectionProps {
  prefilledSpecialRequest?: string;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ prefilledSpecialRequest }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<ReservationResponse['data'] | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const timeSlots = [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM'
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      date: todayStr,
      time: '7:00 PM',
      name: '',
      email: '',
      phone: '',
      specialRequests: prefilledSpecialRequest || '',
    },
  });

  useEffect(() => {
    if (prefilledSpecialRequest) {
      setValue('specialRequests', `Reserved for: ${prefilledSpecialRequest}`);
    }
  }, [prefilledSpecialRequest, setValue]);

  const selectedGuests = watch('guests');


  const onSubmit = async (values: ReservationFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await submitReservation(values);
      if (res.success && res.data) {
        setConfirmationData(res.data);
        reset();
      } else {
        setServerError(res.message || 'Unable to confirm reservation');
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="py-24 bg-obsidian-900 relative overflow-hidden border-t border-obsidian-800">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gold-glow pointer-events-none opacity-30" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Table Booking</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100">
            Reserve Your Experience
          </h2>
          <p className="text-cream-300 text-sm sm:text-base font-light">
            Due to our intimate seating capacity, we advise reserving your table in advance.
          </p>
        </div>

        {/* Form Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-obsidian-950/90 border border-obsidian-750 p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-xl"
        >
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Step 1: Party Size Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-champagne-500 shrink-0" />
                <span>1. Select Number of Guests</span>
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setValue('guests', num)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      selectedGuests === num
                        ? 'bg-champagne-500 text-obsidian-950 shadow-gold-subtle scale-105'
                        : 'bg-obsidian-900 border border-obsidian-800 text-cream-300 hover:border-obsidian-700 hover:text-cream-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {errors.guests && (
                <p className="text-xs text-rose-400 mt-1">{errors.guests.message}</p>
              )}
            </div>

            {/* Step 2: Date & Time Picker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-champagne-500 shrink-0" />
                  <span>2. Reservation Date</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  {...register('date')}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors"
                />
                {errors.date && (
                  <p className="text-xs text-rose-400 mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-champagne-500 shrink-0" />
                  <span>3. Preferred Time Slot</span>
                </label>
                <select
                  {...register('time')}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot} className="bg-obsidian-900 text-cream-100">
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-xs text-rose-400 mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            {/* Step 3: Contact Details */}
            <div className="space-y-4 pt-4 border-t border-obsidian-850">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 flex items-center gap-2">
                <User className="w-4 h-4 text-champagne-500 shrink-0" />
                <span>4. Guest Information</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...register('name')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...register('email')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      {...register('phone')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-400 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-200 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-champagne-500 shrink-0" />
                <span>Dietary Requirements & Special Requests (Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Anniversary celebration, window table, severe food allergies, etc."
                {...register('specialRequests')}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 sm:py-4 px-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider sm:tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  <span>Processing Reservation...</span>
                </>
              ) : (
                <>
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  <span>Confirm Table Reservation</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Confirmation Card Popup */}
      <ReservationConfirmationModal
        data={confirmationData}
        onClose={() => setConfirmationData(null)}
      />
    </section>
  );
};
