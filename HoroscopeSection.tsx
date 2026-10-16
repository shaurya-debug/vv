import React, { useState } from 'react';
import { ZODIAC_SIGNS, ZodiacSign } from '../data/vedicData';
import { Sparkles, Compass, Star, Clock, Gem, Flame, Heart, Briefcase, Calendar, ChevronRight } from 'lucide-react';

interface HoroscopeSectionProps {
  onSelectService?: (serviceName: string) => void;
}

export const HoroscopeSection: React.FC<HoroscopeSectionProps> = ({ onSelectService }) => {
  const [selectedSignId, setSelectedSignId] = useState<string>('aries');
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'weekly'>('today');
  const [birthDateInput, setBirthDateInput] = useState<string>('');
  const [finderMessage, setFinderMessage] = useState<string | null>(null);

  const selectedSign = ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0];

  // Quick sign finder helper by birth date
  const handleFindSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDateInput) return;
    const date = new Date(birthDateInput);
    if (isNaN(date.getTime())) return;

    const month = date.getMonth() + 1; // 1 - 12
    const day = date.getDate();

    let foundId = 'aries';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) foundId = 'aries';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) foundId = 'taurus';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) foundId = 'gemini';
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) foundId = 'cancer';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) foundId = 'leo';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) foundId = 'virgo';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) foundId = 'libra';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) foundId = 'scorpio';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) foundId = 'sagittarius';
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) foundId = 'capricorn';
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) foundId = 'aquarius';
    else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) foundId = 'pisces';

    setSelectedSignId(foundId);
    const signObj = ZODIAC_SIGNS.find((s) => s.id === foundId);
    setFinderMessage(`Your Sun Sign corresponds to ${signObj?.rashi} (${signObj?.english})`);
  };

  const handleBookForSign = (sign: ZodiacSign) => {
    if (onSelectService) {
      onSelectService(`Birth Chart Analysis (₹2,500) — ${sign.english} (${sign.rashi})`);
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="horoscope" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-indigo-800/15 via-purple-700/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Daily Graha Gochara &amp; Rashi Fal</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Daily Vedic Horoscope
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Personalized astrological insights and authentic Vedic guidance for each of the 12 Rashis, prepared with Acharya Jitender Shastri&apos;s classical scriptural calculations.
          </p>

          {/* Quick Date finder for users who don't know their sign */}
          <form
            onSubmit={handleFindSign}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-300"
          >
            <span>Don&apos;t know your sign? Enter birthdate:</span>
            <input
              type="date"
              value={birthDateInput}
              onChange={(e) => setBirthDateInput(e.target.value)}
              className="bg-black/40 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-transform active:scale-95"
            >
              Find Sign
            </button>
          </form>
          {finderMessage && (
            <p className="mt-2 text-xs text-yellow-300 font-medium animate-in fade-in duration-300">
              ✦ {finderMessage}
            </p>
          )}
        </div>

        {/* 12 Zodiac Sign Grid Selector */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3 mb-10">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = sign.id === selectedSignId;
            return (
              <button
                key={sign.id}
                onClick={() => setSelectedSignId(sign.id)}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all duration-300 text-center ${
                  isSelected
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-105 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20 hover:border-yellow-400/40'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">{sign.symbol}</span>
                <span className="text-xs font-cinzel leading-tight line-clamp-1">{sign.english}</span>
                <span
                  className={`text-[10px] ${
                    isSelected ? 'text-black/80 font-semibold' : 'text-yellow-400'
                  }`}
                >
                  {sign.rashi.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Sign Detailed Card */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle cosmic watermark */}
          <div className="absolute right-4 -top-8 text-white/5 text-[160px] sm:text-[220px] font-serif pointer-events-none select-none font-bold">
            {selectedSign.symbol}
          </div>

          <div className="relative z-10">
            {/* Top Bar: Sign identity & Timeframes */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400/15 border border-yellow-400/40 flex items-center justify-center text-3xl text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.25)]">
                  {selectedSign.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                      {selectedSign.english}
                    </h3>
                    <span className="text-yellow-400 font-cinzel text-lg sm:text-xl font-bold">
                      • {selectedSign.rashi}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Dates: <span className="text-white font-medium">{selectedSign.dates}</span> | Element:{' '}
                    <span className="text-yellow-300 font-medium">{selectedSign.element}</span>
                  </p>
                </div>
              </div>

              {/* Timeframe Tabs: Today / Tomorrow / Weekly */}
              <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/15 self-start md:self-auto">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'today'
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Today&apos;s Horoscope
                </button>
                <button
                  onClick={() => setActiveTab('tomorrow')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'tomorrow'
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Tomorrow&apos;s Transit
                </button>
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'weekly'
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Weekly Overview
                </button>
              </div>
            </div>

            {/* Quick Astrological Key Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/15 text-yellow-400 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Ruling Graha</div>
                  <div className="text-sm font-semibold text-white">{selectedSign.rulingPlanetHindi}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/15 text-yellow-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Shubh Muhurat</div>
                  <div className="text-xs font-semibold text-white truncate">{selectedSign.shubhMuhurat}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/15 text-yellow-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Lucky Color &amp; No.</div>
                  <div className="text-xs font-semibold text-white truncate">
                    {selectedSign.luckyNumber} • {selectedSign.luckyColor}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/15 text-yellow-400 flex items-center justify-center shrink-0">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Prescribed Ratna</div>
                  <div className="text-xs font-semibold text-white truncate">{selectedSign.gemstone}</div>
                </div>
              </div>
            </div>

            {/* Prediction Body based on active tab */}
            {activeTab === 'today' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 font-cinzel font-semibold mb-2">
                      <Heart className="w-4 h-4" />
                      <span>Aarogya &amp; Vitality</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {selectedSign.dailyPrediction.health}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 font-cinzel font-semibold mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Career &amp; Wealth (Arth)</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {selectedSign.dailyPrediction.career}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 font-cinzel font-semibold mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Family &amp; Relationships</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {selectedSign.dailyPrediction.relationships}
                    </p>
                  </div>
                </div>

                {/* Acharya Ji's Vedic Guidance & Mantra of the Day */}
                <div className="p-5 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
                      <Flame className="w-4 h-4" />
                      <span>Acharya Jitender Shastri&apos;s Daily Vedic Upay</span>
                    </div>
                    <p className="text-sm text-slate-200">
                      {selectedSign.dailyPrediction.guidance}
                    </p>
                    <div className="mt-2 text-xs font-mono text-yellow-300 bg-black/40 px-3 py-1.5 rounded-lg inline-block border border-yellow-400/20">
                      Mantra: {selectedSign.dailyPrediction.vedicMantra}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookForSign(selectedSign)}
                    className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>Get Detailed Chart for {selectedSign.english}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'tomorrow' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 font-cinzel font-semibold mb-2">
                      <Heart className="w-4 h-4" />
                      <span>Tomorrow&apos;s Vitality</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {selectedSign.tomorrowPrediction.health}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 font-cinzel font-semibold mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Career &amp; Business Transit</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {selectedSign.tomorrowPrediction.career}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 font-cinzel font-semibold mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Domestic Atmosphere</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {selectedSign.tomorrowPrediction.relationships}
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">
                      <Flame className="w-4 h-4" />
                      <span>Acharya Ji&apos;s Tomorrow Transit Counsel</span>
                    </div>
                    <p className="text-sm text-slate-200">
                      {selectedSign.tomorrowPrediction.guidance}
                    </p>
                    <div className="mt-2 text-xs font-mono text-yellow-300 bg-black/40 px-3 py-1.5 rounded-lg inline-block border border-yellow-400/20">
                      Mantra: {selectedSign.tomorrowPrediction.vedicMantra}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookForSign(selectedSign)}
                    className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>Consult Acharya Ji</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'weekly' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-cinzel text-lg font-bold text-yellow-400 mb-2">
                    Weekly Graha Transit Overview
                  </h4>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
                    {selectedSign.weeklyPrediction.overview}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                      <div className="text-xs text-yellow-400 font-semibold uppercase mb-1">
                        Favorable Days (Shubh Vaar)
                      </div>
                      <div className="text-sm font-medium text-white">
                        {selectedSign.weeklyPrediction.favorableDays}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                      <div className="text-xs text-amber-300 font-semibold uppercase mb-1">
                        Vedic Precaution
                      </div>
                      <div className="text-sm font-medium text-white">
                        {selectedSign.weeklyPrediction.precaution}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                      <div className="text-xs text-yellow-400 font-semibold uppercase mb-1">
                        Prescribed Vedic Remedy
                      </div>
                      <div className="text-sm font-medium text-white">
                        {selectedSign.weeklyPrediction.remedy}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleBookForSign(selectedSign)}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>Book Personalized Chart Analysis for {selectedSign.english}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
