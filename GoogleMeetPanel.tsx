import React, { useState } from 'react';
import { Video, ExternalLink, Copy, Check, Sparkles, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { createGoogleMeetSpace } from '../lib/firebase';
import { ASTROLOGER } from '../data/vedicData';

interface GoogleMeetPanelProps {
  accessToken: string | null;
  scheduledMeetLink?: string;
  onMeetCreated?: (meetUrl: string) => void;
}

export const GoogleMeetPanel: React.FC<GoogleMeetPanelProps> = ({
  accessToken,
  scheduledMeetLink,
  onMeetCreated,
}) => {
  const [createdMeetUrl, setCreatedMeetUrl] = useState<string>(scheduledMeetLink || '');
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeMeetUrl = createdMeetUrl || scheduledMeetLink || '';

  const handleCreateMeet = async () => {
    setIsCreating(true);
    try {
      if (accessToken) {
        const space = await createGoogleMeetSpace(accessToken);
        if (space?.meetingUri) {
          setCreatedMeetUrl(space.meetingUri);
          if (onMeetCreated) onMeetCreated(space.meetingUri);
          return;
        }
      }
      // Direct instant fallback link for Google Meet
      const instantLink = `https://meet.google.com/new`;
      setCreatedMeetUrl(instantLink);
      if (onMeetCreated) onMeetCreated(instantLink);
    } catch (e) {
      console.warn('Error initiating meet space:', e);
      setCreatedMeetUrl(`https://meet.google.com/new`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = () => {
    if (!activeMeetUrl) return;
    navigator.clipboard.writeText(activeMeetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Google Meet Video Consultation</h3>
              <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Active 1-on-1
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live face-to-face Vedic astrology &amp; face reading with {ASTROLOGER.name}
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={handleCreateMeet}
            disabled={isCreating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/50 transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            {isCreating ? 'Generating Room...' : 'Start Instant Google Meet'}
          </button>
        </div>
      </div>

      {activeMeetUrl ? (
        <div className="bg-slate-950/80 border border-emerald-500/40 rounded-xl p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                Your Dedicated Google Meet Room Link
              </div>
              <div className="text-sm font-mono text-slate-200 break-all select-all">
                {activeMeetUrl}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <a
                href={activeMeetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                Join Video Call
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-4 text-center mb-5">
          <p className="text-xs text-slate-400">
            Click <strong className="text-slate-200">Start Instant Google Meet</strong> above or book an appointment below to automatically receive your Google Meet video room link.
          </p>
        </div>
      )}

      {/* Vedic Guidelines for Video Session */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-medium">Session Timings</strong>
            Mon - Sat: 4 PM - 8 PM IST<br />
            Sun: 10 AM - 5 PM IST
          </div>
        </div>
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
          <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-medium">Have Ready</strong>
            Date, exact time, and city of birth for precise Janam Kundli analysis.
          </div>
        </div>
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-medium">Confidential &amp; Sacred</strong>
            Private, 100% confidential spiritual consultation with Acharya Ji.
          </div>
        </div>
      </div>
    </div>
  );
};
