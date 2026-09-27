import React from 'react';
import { UtensilsCrossed, Share2, Globe, Send, ArrowUp } from 'lucide-react';


export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-obsidian-950 text-cream-300 border-t border-obsidian-800 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-obsidian-850">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <a href="#hero" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-champagne-500/40 flex items-center justify-center bg-obsidian-850">
                <UtensilsCrossed className="w-5 h-5 text-champagne-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-cream-100 tracking-wider">
                  L'Étoile Noir
                </span>
                <span className="text-[10px] tracking-[0.25em] text-champagne-500 uppercase font-medium">
                  Haute Cuisine
                </span>
              </div>
            </a>
            <p className="text-xs text-cream-300 font-light max-w-sm leading-relaxed">
              An intimate obsidian sanctuary dedicated to rare seasonal harvests, artisanal dry-aged meats, and Michelin-rated culinary craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="p-2 rounded-full bg-obsidian-900 border border-obsidian-800 text-cream-300 hover:text-champagne-400 transition-colors" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#facebook" className="p-2 rounded-full bg-obsidian-900 border border-obsidian-800 text-cream-300 hover:text-champagne-400 transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 rounded-full bg-obsidian-900 border border-obsidian-800 text-cream-300 hover:text-champagne-400 transition-colors" aria-label="Connect">
                <Send className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-cream-100">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#hero" className="hover:text-champagne-400 transition-colors">Home Experience</a></li>
              <li><a href="#menu" className="hover:text-champagne-400 transition-colors">Seasonal Menu</a></li>
              <li><a href="#about" className="hover:text-champagne-400 transition-colors">Our Philosophy</a></li>
              <li><a href="#gallery" className="hover:text-champagne-400 transition-colors">Visual Gallery</a></li>
              <li><a href="#reviews" className="hover:text-champagne-400 transition-colors">Guest Accolades</a></li>
              <li><a href="#reservation" className="hover:text-champagne-400 transition-colors">Table Booking</a></li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-cream-100">
              Address & Hours
            </h4>
            <div className="text-xs space-y-2 font-light text-cream-300">
              <p>425 Madison Avenue, Midtown Manhattan, NY 10017</p>
              <p className="text-champagne-400 font-medium">Tue – Sun: 5:00 PM – 11:30 PM</p>
              <p>Direct Concierge: +1 (555) 839-2041</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <div>
            © {new Date().getFullYear()} L'Étoile Noir Fine Dining. All Rights Reserved.
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-cream-300 hover:text-champagne-400 transition-colors py-1 px-3 rounded-full bg-obsidian-900 border border-obsidian-800"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
