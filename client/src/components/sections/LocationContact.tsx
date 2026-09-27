import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink, Share2, Globe, Send } from 'lucide-react';


export const LocationContact: React.FC = () => {
  const openingHours = [
    { days: 'Tuesday – Thursday', hours: '5:00 PM – 11:00 PM' },
    { days: 'Friday – Saturday', hours: '5:00 PM – 12:00 AM' },
    { days: 'Sunday', hours: '4:30 PM – 10:30 PM' },
    { days: 'Monday', hours: 'Closed (Private Events Only)' },
  ];

  return (
    <section id="contact" className="py-24 bg-obsidian-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Us</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100">
            Location & Service Hours
          </h2>
          <p className="text-cream-300 text-sm sm:text-base font-light">
            Situated in Midtown Manhattan, step into an sanctuary of warmth, elegance, and unforgettable dining.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-obsidian-900 border border-obsidian-750 p-5 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-cream-100 pb-4 border-b border-obsidian-800">
                Contact Information
              </h3>

              <div className="space-y-5 text-sm text-cream-300">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-obsidian-850 text-champagne-500 border border-obsidian-750 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-cream-100">Address</div>
                    <div className="font-light text-cream-300">425 Madison Ave, Midtown</div>
                    <div className="font-light text-cream-400 text-xs">New York, NY 10017</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-obsidian-850 text-champagne-500 border border-obsidian-750 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-cream-100">Phone Reservations</div>
                    <div className="font-light text-cream-300">+1 (555) 839-2041</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-obsidian-850 text-champagne-500 border border-obsidian-750 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-cream-100">Inquiries & Events</div>
                    <div className="font-light text-cream-300 break-all sm:break-normal">concierge@letoilenoir.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Table */}
            <div className="pt-6 border-t border-obsidian-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-champagne-400 mb-2">
                <Clock className="w-4 h-4" />
                <span>Operating Schedule</span>
              </div>
              {openingHours.map((slot, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5 border-b border-obsidian-850 gap-0.5 sm:gap-2">
                  <span className="text-cream-300 font-medium">{slot.days}</span>
                  <span className="text-cream-400">{slot.hours}</span>
                </div>
              ))}
            </div>

            {/* Social Links & Directions CTA */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <a href="#instagram" className="p-2.5 rounded-full bg-obsidian-850 border border-obsidian-750 text-cream-300 hover:text-champagne-400 hover:border-champagne-500/40 transition-colors" aria-label="Share">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#facebook" className="p-2.5 rounded-full bg-obsidian-850 border border-obsidian-750 text-cream-300 hover:text-champagne-400 hover:border-champagne-500/40 transition-colors" aria-label="Website">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#twitter" className="p-2.5 rounded-full bg-obsidian-850 border border-obsidian-750 text-cream-300 hover:text-champagne-400 hover:border-champagne-500/40 transition-colors" aria-label="Connect">
                  <Send className="w-4 h-4" />
                </a>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-500 text-obsidian-950 text-xs font-semibold uppercase tracking-wider hover:bg-champagne-400 transition-colors shrink-0"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </motion.div>

          {/* Right Map Placeholder Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-obsidian-900 border border-obsidian-750 rounded-3xl overflow-hidden shadow-2xl relative min-h-[380px] lg:min-h-full flex flex-col justify-end p-8"
          >
            {/* Styled Dark Map Image preview */}
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
              alt="L'Étoile Noir Map Location"
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-obsidian-950/20" />

            {/* Overlaid Location Card */}
            <div className="relative z-10 bg-obsidian-900/90 backdrop-blur-md p-6 rounded-2xl border border-obsidian-700/80 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-champagne-500 animate-ping" />
                <h4 className="font-serif font-bold text-cream-100 text-lg">L'Étoile Noir Flagship</h4>
              </div>
              <p className="text-xs text-cream-300 font-light mb-4">
                Valet parking available at the main entrance on Madison Avenue. Private dining rooms available upon request.
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-champagne-400 hover:text-champagne-300 transition-colors uppercase tracking-wider"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
