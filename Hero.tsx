import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Star, Award, CheckCircle2, Smartphone, FileArchive, Mic } from 'lucide-react';
import { ASTROLOGER } from '../data/vedicData';
import { PanditPortrait } from './PanditPortrait';
import { downloadAndroidApp, downloadRealZip } from '../utils/downloader';

interface HeroProps {
  onOpenVoiceGuide?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenVoiceGuide }) => {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background celestial ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-gradient-to-tr from-purple-600/20 via-indigo-500/20 to-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Vedic Astrological Yantra Geometry in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full border border-yellow-400/40 relative animate-[spin_120s_linear_infinite]">
          <div className="absolute inset-8 rounded-full border border-yellow-400/30" />
          <div className="absolute inset-16 rounded-full border border-dashed border-yellow-400/40" />
          <div className="absolute inset-28 rounded-full border border-yellow-400/25" />
          {/* Planetary coordinate spokes */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-yellow-400/30" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-yellow-400/30" />
          <div className="absolute inset-0 rotate-45 border-t border-b border-yellow-400/20" />
          <div className="absolute inset-0 -rotate-45 border-l border-r border-yellow-400/20" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Small pill badge "28 Years of Experience" */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs sm:text-sm font-medium text-yellow-300 mb-6 shadow-[0_0_20px_rgba(250,204,21,0.15)] animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>{ASTROLOGER.experienceYears} Years of Experience</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              <span className="text-slate-300">Sanatana Parampara</span>
            </div>

            {/* Huge title "Vedic Pandit" */}
            <h1 className="font-cinzel text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-3 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
              {ASTROLOGER.brandName}
            </h1>

            {/* Subtitle in yellow "Acharya Jitender Shastri" */}
            <div className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-yellow-400 tracking-wide mb-4 drop-shadow-[0_2px_10px_rgba(250,204,21,0.4)]">
              {ASTROLOGER.heroSubtitle}
            </div>

            {/* Exact Line with user requested spelling */}
            <p className="text-sm sm:text-base font-medium text-slate-200 tracking-wide max-w-2xl mb-6 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 backdrop-blur-sm">
              {ASTROLOGER.heroLine}
            </p>

            {/* Short paragraph about unlocking destiny */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              {ASTROLOGER.heroParagraph}
            </p>

            {/* Buttons: Book Consultation, Live Voice, and About */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-base px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(250,204,21,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              {onOpenVoiceGuide && (
                <button
                  type="button"
                  onClick={onOpenVoiceGuide}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-base px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer border border-amber-300/40"
                >
                  <Mic className="w-5 h-5 fill-slate-950" />
                  <span>Talk with Live AI Voice</span>
                </button>
              )}

              <a
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/15 text-slate-100 hover:text-yellow-300 border border-white/20 hover:border-yellow-400/50 font-medium text-base px-6 py-3.5 rounded-xl backdrop-blur-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <span>About Acharya Ji</span>
              </a>
            </div>

            {/* Quick Offline App & ZIP Download Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mb-8 p-2.5 sm:p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <span className="text-xs text-yellow-400 font-semibold px-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get App Offline:</span>
              </span>

              <button
                onClick={downloadAndroidApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                title="Download Single HTML Android App"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android App (.html)</span>
              </button>

              <button
                onClick={downloadRealZip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-400/40 text-yellow-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(250,204,21,0.15)]"
                title="Download Real ZIP Package of Vedic Pandit"
              >
                <FileArchive className="w-3.5 h-3.5 text-yellow-400" />
                <span>Download Real ZIP (.zip)</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-300 w-full">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>100% Scriptural Vidhi</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Star className="w-4 h-4 text-yellow-400 shrink-0 fill-yellow-400" />
                <span>Certified Gemstones</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Confidential Reading</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Astrologer Portrait Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm rounded-3xl border border-purple-400/25 bg-gradient-to-b from-[#241747]/90 via-[#1e133e]/80 to-[#140b2e]/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center text-center">
              {/* Subtle top-left curved highlight border matching screenshot */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-purple-300/40 rounded-tl-3xl pointer-events-none" />

              {/* Astrologer Portrait Component */}
              <PanditPortrait size="normal" showControls={true} />

              {/* Credentials Below Portrait */}
              <div className="mt-4 flex flex-col items-center">
                <span className="font-cinzel text-lg font-bold text-white">
                  Acharya Jitender Shastri
                </span>
                <span className="text-yellow-400 text-xs uppercase tracking-wider font-semibold">
                  Tantra Samrat &amp; Gem Consultant
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

