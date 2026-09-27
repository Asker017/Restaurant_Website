import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Review } from '../../types';


interface ReviewsSectionProps {
  reviews: Review[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews" className="py-24 bg-obsidian-900 relative overflow-hidden border-y border-obsidian-800">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-champagne-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <Quote className="w-3.5 h-3.5" />
          <span>Accolades & Praise</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100 mb-12">
          What Critics & Guests Say
        </h2>

        {/* Carousel Container */}
        <div className="relative bg-obsidian-950/80 p-8 sm:p-12 rounded-3xl border border-obsidian-750 shadow-2xl backdrop-blur-md min-h-[320px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Star Rating */}
              <div className="flex items-center justify-center gap-1.5 text-champagne-500">
                {[...Array(currentReview.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-champagne-500 text-champagne-500" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="font-serif text-lg sm:text-2xl font-light italic text-cream-100 leading-relaxed">
                "{currentReview.comment}"
              </p>

              {/* Author Details */}
              <div className="flex items-center justify-center gap-4 pt-4">
                {currentReview.avatar && (
                  <img
                    src={currentReview.avatar}
                    alt={currentReview.name}
                    className="w-12 h-12 rounded-full object-cover border border-champagne-500/40"
                  />
                )}
                <div className="text-left">
                  <h4 className="font-serif font-semibold text-cream-100 text-base">
                    {currentReview.name}
                  </h4>
                  <div className="text-xs text-champagne-400 font-medium">
                    {currentReview.role} {currentReview.date && `• ${currentReview.date}`}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-obsidian-800/80 mt-6">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-obsidian-900 text-cream-300 hover:text-champagne-400 hover:bg-obsidian-850 border border-obsidian-750 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-champagne-500' : 'w-2 bg-obsidian-750'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-obsidian-900 text-cream-300 hover:text-champagne-400 hover:bg-obsidian-850 border border-obsidian-750 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
