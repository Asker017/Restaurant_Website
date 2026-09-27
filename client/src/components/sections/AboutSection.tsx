import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, ShieldCheck } from 'lucide-react';


export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-obsidian-900 relative overflow-hidden border-y border-obsidian-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Left Side Image & Chef Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Image */}
              <div className="relative rounded-2xl overflow-hidden border border-obsidian-750 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80"
                  alt="Executive Chef Antoine Guérin"
                  className="w-full h-[480px] sm:h-[560px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
              </div>

              {/* Overlaid Secondary Accent Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-6 -right-4 sm:bottom-8 sm:-right-6 max-w-xs bg-obsidian-850 p-6 rounded-xl border border-champagne-500/30 shadow-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-champagne-500/10 text-champagne-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-cream-100 text-sm">3 Michelin Stars</h4>
                    <span className="text-[11px] text-cream-400">2021, 2023, 2025</span>
                  </div>
                </div>
                <p className="text-xs text-cream-300 font-light italic">
                  "Cooking is not merely technical precision; it is an emotional conversation between nature, fire, and memory."
                </p>
                <div className="mt-3 text-[11px] font-semibold text-champagne-400 uppercase tracking-widest">
                  — Chef Antoine Guérin
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Editorial Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-widest">
              <span>Our Culinary Heritage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-100 leading-tight">
              An Obsession With Fine Gastronomy & Artisanal Craft
            </h2>

            <p className="text-cream-300 text-sm sm:text-base font-light leading-relaxed">
              Founded in 2012 in the heart of Manhattan, L'Étoile Noir was built on a singular vision: to strip away culinary pretension and return to the dramatic essence of pure flavor.
            </p>

            <p className="text-cream-300 text-sm sm:text-base font-light leading-relaxed">
              Every evening, Executive Chef Antoine Guérin presents a curated culinary journey that pays homage to classic French techniques while incorporating rare Japanese ingredients and wood-fired binchotan craftsmanship.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-obsidian-950/60 border border-obsidian-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-champagne-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-cream-100">100% Farm-Fresh</h4>
                  <p className="text-xs text-cream-400">Harvested daily from organic regenerative local farms.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-950/60 border border-obsidian-800 flex items-start gap-3">
                <Flame className="w-5 h-5 text-champagne-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-cream-100">Binchotan Grill</h4>
                  <p className="text-xs text-cream-400">White oak charcoal reaching 1,800°F for perfect searing.</p>
                </div>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="pt-6 border-t border-obsidian-800 grid grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <div className="font-serif text-3xl font-bold text-champagne-400">14+</div>
                <div className="text-xs text-cream-400">Years Established</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-champagne-400">350+</div>
                <div className="text-xs text-cream-400">Botanical Elixirs</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-champagne-400">100%</div>
                <div className="text-xs text-cream-400">Organic Artisanal</div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
