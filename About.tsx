import React from 'react';
import { PanditPortrait } from './PanditPortrait';
import { ASTROLOGER } from '../data/vedicData';
import { Award, CheckCircle, BookOpen, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Authentic circular portrait styled exactly as requested with gold border and cosmic purple card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-3xl border border-purple-400/25 bg-gradient-to-b from-[#241747]/90 via-[#1e133e]/80 to-[#140b2e]/95 backdrop-blur-xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center text-center">
              {/* Subtle top-left curved highlight line matching screenshot */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-purple-300/40 rounded-tl-3xl pointer-events-none" />
              
              <PanditPortrait size="normal" />

              <div className="mt-6 flex flex-col items-center">
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {ASTROLOGER.name}
                </h3>
                <p className="text-yellow-400 text-xs uppercase tracking-widest font-semibold mt-1">
                  {ASTROLOGER.titles}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-xs text-yellow-300">
                  <Award className="w-3.5 h-3.5" />
                  <span>Lineage of Sanatana Purohits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-yellow-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vedic Lineage &amp; Philosophy</span>
            </div>

            {/* Heading */}
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              {ASTROLOGER.aboutHeading}
            </h2>

            {/* Paragraph with required yellow highlights */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              With over 28 years of dedicated practice in traditional Jyotish Shastra, Acharya Jitender Shastri provides profound clarity on birth charts, planetary transitions (Graha Gochara), and life destinies. Revered with the prestigious title of{' '}
              <span className="text-yellow-400 font-semibold underline decoration-yellow-400/40 underline-offset-4">
                Tantra Samrat
              </span>{' '}
              for his unmatched mastery in tantric remedies, shanti pooja, and dosh nivaran, his rituals are strictly grounded in classical Vedic Agamas. As a certified{' '}
              <span className="text-yellow-400 font-semibold underline decoration-yellow-400/40 underline-offset-4">
                gem consultant
              </span>
              , Acharya ji conducts authentic ratna parikshan to recommend only genuine, laboratory-certified gemstones attuned to your birth lagna and Mahadasha.
            </p>

            <p className="text-slate-300 text-base leading-relaxed mb-10">
              Every consultation is treated as a sacred Vedic trust. Whether resolving complex marriage delays, business impediments, health anxieties, or negative planetary afflictions, the solutions given are practical, scriptural, and spiritually uplifting.
            </p>

            {/* 3-Column Stat Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-white/10">
              {ASTROLOGER.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center hover:bg-white/15 hover:border-yellow-400/40 transition-all duration-300 group"
                >
                  <div className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-extrabold text-yellow-400 mb-1 group-hover:scale-105 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                <span>Request Janma Kundali Review</span>
                <CheckCircle className="w-4 h-4" />
              </a>
              <a
                href="#specialties"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-yellow-400 text-sm font-medium px-4 py-3 transition-colors"
              >
                <span>Explore Disciplines</span>
                <span className="text-yellow-400">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
