import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Utensils, Calendar, MapPin, Clock, Award } from 'lucide-react';

interface HeroProps {
  onOpenReservation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReservation }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] as const },
    },
  };


  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Ambient background gold glow & subtle grid */}
      <div className="absolute inset-0 bg-gold-glow pointer-events-none opacity-40" />
      <div 
        className="absolute inset-0 bg-[radial-gradient(#202024_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left"
          >
            {/* Top Distinction Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-obsidian-850 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-widest">
              <Award className="w-4 h-4 text-champagne-500" />
              <span>3 Michelin Star Rated • Established 2012</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={itemVariants} className="font-serif text-4xl sm:text-6xl xl:text-7xl font-normal text-cream-100 leading-[1.1] tracking-tight">
              Where Culinary Art <br />
              <span className="italic font-normal text-gold-gradient">Meets Noir Elegance</span>
            </motion.h1>

            {/* Supporting Description */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-cream-300 max-w-xl leading-relaxed font-light">
              Experience the pinnacle of haute cuisine. Crafted with seasonal rare botanicals, dry-aged cuts, and wild ocean harvests served in an intimate obsidian atmosphere.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenReservation}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Table</span>
              </button>

              <a
                href="#menu"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium uppercase tracking-widest text-cream-200 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 hover:border-champagne-500/40 transition-all duration-300 hover:text-cream-100"
              >
                <Utensils className="w-4 h-4 text-champagne-500" />
                <span>Explore Menu</span>
              </a>
            </motion.div>

            {/* Supporting Info Bar */}
            <motion.div variants={itemVariants} className="pt-8 border-t border-obsidian-800/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-cream-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-champagne-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-cream-200 font-medium">Opening Hours</div>
                  <div>Tue–Sun: 5:00 PM – 11:30 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-champagne-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-cream-200 font-medium">Location</div>
                  <div>425 Madison Ave, New York</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-champagne-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-cream-200 font-medium">Dress Code</div>
                  <div>Smart Elegant / Formal</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Cinematic Hero Imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer gold ring glow */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-champagne-500/20 via-transparent to-champagne-400/10 blur-xl" />

              {/* Main Dish Photo Container */}
              <div className="relative rounded-2xl overflow-hidden border border-obsidian-750 bg-obsidian-900 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                  alt="Seared Wagyu Carpaccio by L'Étoile Noir"
                  className="w-full h-[440px] sm:h-[520px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent" />

                {/* Overlaid Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-obsidian-900/85 backdrop-blur-md p-4 rounded-xl border border-obsidian-700/60 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-widest text-champagne-400 font-semibold uppercase">Chef's Signature</span>
                    <h3 className="font-serif text-lg text-cream-100 font-semibold">Seared Wagyu Carpaccio</h3>
                    <p className="text-xs text-cream-300">A5 Japanese Wagyu & Black Winter Truffle</p>
                  </div>
                  <span className="font-serif text-xl font-bold text-champagne-400">$38</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-cream-400 text-xs tracking-widest uppercase opacity-70"
      >
        <span>Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 text-champagne-500" />
      </motion.div>
    </section>
  );
};
