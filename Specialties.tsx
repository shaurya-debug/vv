import React from 'react';
import { SPECIALTIES } from '../data/vedicData';
import { VedicIcon } from './VedicIcon';
import { ArrowRight } from 'lucide-react';

export const Specialties: React.FC = () => {
  return (
    <section id="specialties" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Guiding Principles</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Areas of Expertise
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Three disciplines, one lineage of authentic Vedic knowledge passed down through generations.
          </p>
        </div>

        {/* Three centered cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPECIALTIES.map((spec, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-yellow-400/40 transition-all duration-300 flex flex-col items-center text-center shadow-xl hover:-translate-y-1.5"
            >
              {/* Yellow icon in rounded yellow/15 background */}
              <div className="w-16 h-16 rounded-2xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-6 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                <VedicIcon name={spec.icon} className="w-8 h-8" />
              </div>

              {/* Title */}
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                {spec.title}
              </h3>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 flex-grow">
                {spec.description}
              </p>

              {/* Card Footer Action */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 tracking-wider uppercase transition-colors"
              >
                <span>Consult on this</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
