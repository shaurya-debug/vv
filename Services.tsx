import React from 'react';
import { SERVICES, ServiceItem } from '../data/vedicData';
import { VedicIcon } from './VedicIcon';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ServicesProps {
  onSelectService?: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const handleBookNow = (service: ServiceItem) => {
    if (onSelectService) {
      onSelectService(`${service.title} (${service.price})`);
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Astrology &amp; Consultation</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Our Services
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Personalized Vedic consultations rooted in ancient wisdom to illuminate your life&apos;s journey and overcome worldly challenges.
          </p>
        </div>

        {/* Six Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group relative p-7 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-yellow-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
            >
              <div>
                {/* Yellow Icon in rounded yellow/15 background */}
                <div className="w-14 h-14 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors duration-300 mb-6 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                  <VedicIcon name={service.iconName} className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Bottom: Price & Yellow "Book Now" button */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Dakshina</div>
                  <div className="font-cinzel text-2xl font-extrabold text-yellow-400">
                    {service.price}
                  </div>
                </div>

                <button
                  onClick={() => handleBookNow(service)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
