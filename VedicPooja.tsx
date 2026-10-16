import React from 'react';
import { VEDIC_POOJAS, PoojaItem } from '../data/vedicData';
import { Shield, Clock, ArrowRight } from 'lucide-react';
import { VedicIcon } from './VedicIcon';

interface VedicPoojaProps {
  onSelectService?: (serviceName: string) => void;
}

export const VedicPooja: React.FC<VedicPoojaProps> = ({ onSelectService }) => {
  const handleBook = (pooja: PoojaItem) => {
    if (onSelectService) {
      onSelectService(`${pooja.title} (${pooja.price})`);
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="pooja"
      className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-r from-amber-950/40 via-purple-950/60 to-indigo-950/40 border-y border-yellow-500/20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield className="w-4 h-4 text-yellow-400" />
            <span>Sacred Sanatana Rituals</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Vedic Pooja
            </h2>
          </div>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            All types of vadic pooja performed by Acharya Jitender Shastri strictly according to sanatana vidhi — samagri, sankalp, aasan and prasad included.
          </p>
        </div>

        {/* Six Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VEDIC_POOJAS.map((pooja) => (
            <div
              key={pooja.id}
              className="group relative p-7 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-yellow-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
            >
              <div>
                {/* Top Row: Icon & Duration Pill (top right) */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors duration-300 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                    <VedicIcon name={pooja.iconName} className="w-7 h-7" />
                  </div>

                  {/* Duration Pill top right */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-xs font-medium text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{pooja.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                  {pooja.title}
                </h3>

                {/* Devanagari Sanskrit line in small yellow text */}
                <div className="font-devanagari text-sm font-semibold text-yellow-400 mb-3 tracking-wide">
                  {pooja.sanskrit}
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {pooja.description}
                </p>
              </div>

              {/* Bottom Row: Price & Yellow "Book Pooja" button */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Dakshina</div>
                  <div className="font-cinzel text-2xl font-extrabold text-yellow-400">
                    {pooja.price}
                  </div>
                </div>

                <button
                  onClick={() => handleBook(pooja)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                >
                  <span>Book Pooja</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Gold-bordered Notice Box */}
        <div className="mt-14 p-6 sm:p-7 rounded-2xl bg-black/40 border-2 border-yellow-400/60 shadow-[0_0_25px_rgba(250,204,21,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-slate-200 text-sm sm:text-base">
            <span className="text-yellow-400 font-semibold">Note:</span> Pooja dates and muhurat are fixed after checking your janma patrika.
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 active:scale-95"
          >
            <span>Contact Acharya ji to book</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
