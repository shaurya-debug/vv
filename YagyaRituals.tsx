import React from 'react';
import { YAGYAS, YagyaItem, HINDU_RITUALS_CATEGORIES } from '../data/vedicData';
import { Flame, Clock, ArrowRight, Scroll, Sparkles } from 'lucide-react';
import { VedicIcon } from './VedicIcon';

interface YagyaRitualsProps {
  onSelectService?: (serviceName: string) => void;
}

export const YagyaRituals: React.FC<YagyaRitualsProps> = ({ onSelectService }) => {
  const handleBookYagya = (yagya: YagyaItem) => {
    if (onSelectService) {
      onSelectService(`${yagya.title} (${yagya.price})`);
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAskRitual = (ritualName: string) => {
    if (onSelectService) {
      onSelectService(`Hindu Ritual: ${ritualName}`);
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="yagya" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-yellow-400" />
            <span>Agni Hotra &amp; Havan Parampara</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Yagya &amp; Hindu Rituals
            </h2>
          </div>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            All types of yagya and havan performed by Acharya Jitender Shastri with full samagri, sankalp, kalash sthapana and purohit vidhi according to sanatana parampara.
          </p>
        </div>

        {/* Six Yagya Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {YAGYAS.map((yagya) => (
            <div
              key={yagya.id}
              className="group relative p-7 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-yellow-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
            >
              <div>
                {/* Top Row: Icon & Duration Pill */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors duration-300 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                    <VedicIcon name={yagya.iconName} className="w-7 h-7" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-xs font-medium text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{yagya.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                  {yagya.title}
                </h3>

                {/* Devanagari Sanskrit line in small yellow text */}
                <div className="font-devanagari text-sm font-semibold text-yellow-400 mb-3 tracking-wide">
                  {yagya.sanskrit}
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {yagya.description}
                </p>
              </div>

              {/* Bottom Row: Price & Yellow "Book Yagya" button */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Dakshina</div>
                  <div className="font-cinzel text-2xl font-extrabold text-yellow-400">
                    {yagya.price}
                  </div>
                </div>

                <button
                  onClick={() => handleBookYagya(yagya)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                >
                  <span>Book Yagya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Box */}
        <div className="mb-20 p-6 sm:p-7 rounded-2xl bg-black/40 border-2 border-yellow-400/60 shadow-[0_0_25px_rgba(250,204,21,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-slate-200 text-sm sm:text-base">
            <span className="text-yellow-400 font-semibold">Special Jaap &amp; Havan:</span> Sankatmochan, Vishnu, Shani, Mangal, Bhairav and Navratri jaap havan are also performed on request.
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 active:scale-95"
          >
            <span>Ask Acharya ji for samay aur dakshina</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Sub-Section: Hindu Rituals & Sanskar */}
        <div className="pt-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-yellow-400/20">
              <Scroll className="w-3.5 h-3.5" />
              <span>Sanatana Shodasha Sanskar &amp; Karmakand</span>
            </div>
            <h3 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              Hindu Rituals &amp; Sanskar
            </h3>
            <p className="text-slate-300 text-sm sm:text-base">
              Sanskar from birth to marriage, griha and vaastu vidhi, pitra karma and vrat — all performed as per your kul parampara and shubh muhurat.
            </p>
          </div>

          {/* Three List-Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {HINDU_RITUALS_CATEGORIES.map((category, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-xl font-bold text-white">
                        {category.title}
                      </h4>
                      <p className="text-xs text-yellow-400/90 font-medium">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="my-6 space-y-4">
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="p-3.5 rounded-xl bg-black/25 border border-white/5 hover:border-yellow-400/30 transition-colors"
                      >
                        <div className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
                          <span className="text-yellow-400 font-bold">•</span>
                          <span>{item.name}</span>
                        </div>
                        <div className="text-xs text-slate-300 leading-relaxed pl-3">
                          {item.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleAskRitual(category.title)}
                    className="w-full inline-flex items-center justify-center gap-2 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    <span>Ask for date &amp; vidhi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
