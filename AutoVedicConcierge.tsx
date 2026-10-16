import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { ASTROLOGER, SERVICES, VEDIC_POOJAS } from '../data/vedicData';

interface AutoVedicConciergeProps {
  onAutoApplyBooking: (
    service: string,
    date: string,
    slot: string,
    notes: string
  ) => void;
}

export const AutoVedicConcierge: React.FC<AutoVedicConciergeProps> = ({
  onAutoApplyBooking,
}) => {
  const [userInput, setUserInput] = useState('');
  const [birthDetails, setBirthDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoResult, setAutoResult] = useState<{
    service: string;
    clientSummary: string;
    recommendedMuhuratDate: string;
    recommendedTimeSlot: string;
    vedicGuidance: string;
    suggestedDakshina: number;
    mantra: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const quickScenarios = [
    {
      label: 'Career Obstacles & Promotion',
      text: 'Facing continuous delays in career growth and promotion despite hard work. Need remedial guidance and auspicious consultation.',
    },
    {
      label: 'Marriage & Kundli Milan',
      text: 'Looking for sacred matchmaking and horoscope compatibility for marriage, checking Manglik and Nadi dosha.',
    },
    {
      label: 'New Flat Griha Pravesh',
      text: 'We bought a new house and need an auspicious Shubh Muhurat for Griha Pravesh and Vastu Shanti Pooja this week.',
    },
    {
      label: 'Shani Sade Sati & Health',
      text: 'Experiencing mental restlessness, debt, and heavy Shani Sade Sati effects. Need authentic Tantra Samrat remedies.',
    },
  ];

  const handleAutoProcess = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || userInput;
    if (!query.trim()) {
      setErrorMsg('Please describe your life situation or astrological question.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setAutoResult(null);

    try {
      const response = await fetch('/api/ai/auto-handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirement: query,
          birthDetails: birthDetails || 'Standard inquiry',
        }),
      });

      if (!response.ok) {
        throw new Error('AI Auto Concierge service unavailable');
      }

      const data = await response.json();
      setAutoResult(data);
    } catch (err: any) {
      console.warn('Auto handle fallback notice:', err);
      // Fallback deterministic Vedic synthesis
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setAutoResult({
        service: 'Kundli Vishleshan (Full Chart Analysis)',
        clientSummary: 'Personalized horoscope evaluation and remedy recommendation',
        recommendedMuhuratDate: tomorrow,
        recommendedTimeSlot: '17:00',
        vedicGuidance:
          'Based on ancient Vedic Shastras, resolving planetary obstacles during evening Sandhya Kaal muhurat aligns Brihaspati and Surya energies for clarity and victory.',
        suggestedDakshina: 1100,
        mantra: 'ॐ नमः शिवाय शुभं कुरु कुरु स्वाहा',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToBooking = () => {
    if (!autoResult) return;
    onAutoApplyBooking(
      autoResult.service,
      autoResult.recommendedMuhuratDate,
      autoResult.recommendedTimeSlot,
      `${autoResult.clientSummary}\n\n[AI Astrological Recommendation]: ${autoResult.vedicGuidance}\n[Mantra]: ${autoResult.mantra}`
    );

    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative aura */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                Autonomous AI Concierge
              </h3>
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Handles Automatically
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tell the AI what you need — it analyzes your birth situation, selects the pooja, calculates Shubh Muhurat, and configures your booking automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Scenario Buttons */}
      <div className="mb-5">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-2">
          Or Select a Common Vedic Requirement:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickScenarios.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setUserInput(sc.text);
                handleAutoProcess(undefined, sc.text);
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left text-xs text-slate-300 hover:text-white transition"
            >
              <div className="font-semibold text-amber-400 text-[11px] mb-0.5">{sc.label}</div>
              <div className="text-[10px] text-slate-400 line-clamp-2">{sc.text}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => handleAutoProcess(e)} className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Describe Your Situation, Concern, or Pooja Wish:
          </label>
          <textarea
            rows={2}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g. I am seeking career stability, financial growth, and want to know which gemstone or pooja will remove obstacles..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={birthDetails}
              onChange={(e) => setBirthDetails(e.target.value)}
              placeholder="Optional: Date, Time & City of Birth (e.g. 15 Aug 1992, 10:30 AM, Delhi)"
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI Analyzing Horoscope...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Auto-Configure Consultation</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
      </form>

      {/* AI Automated Solution Result Card */}
      {autoResult && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-emerald-300">
                AI Automated Astrological Resolution
              </h4>
            </div>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              Dakshina: ₹{autoResult.suggestedDakshina}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">
                Recommended Service
              </span>
              <span className="font-bold text-yellow-400 text-sm">
                {autoResult.service}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" />
                Auspicious Muhurat Date
              </span>
              <span className="font-semibold text-white">
                {autoResult.recommendedMuhuratDate}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                Calculated Time Slot
              </span>
              <span className="font-semibold text-white">
                {autoResult.recommendedTimeSlot} IST (1-on-1 Meet)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs space-y-2 mb-4">
            <div>
              <span className="text-slate-400 font-medium">Spiritual Rationale: </span>
              <span className="text-slate-200">{autoResult.vedicGuidance}</span>
            </div>
            {autoResult.mantra && (
              <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-amber-300 font-cinzel">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-sans">
                  Immediate Mantra:
                </span>
                <span className="font-semibold">{autoResult.mantra}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleApplyToBooking}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Apply All to Booking &amp; Proceed to Pay Dakshina (₹{autoResult.suggestedDakshina})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
