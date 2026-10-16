import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  PhoneOff,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ASTROLOGER } from '../data/vedicData';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBooking?: (service: string, date: string, slot: string, message: string) => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onApplyBooking,
}) => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [userTranscript, setUserTranscript] = useState('');
  const [aiResponseText, setAiResponseText] = useState(
    'ॐ नमो भगवते वासुदेवाय। Hari Om! I am your Vedic AI Voice Guide. How may I assist your life path or Janam Kundli today?'
  );
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Fenrir' | 'Zephyr'>('Kore');
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(true);
  const [recognizedSuggestion, setRecognizedSuggestion] = useState<{
    service: string;
    date?: string;
    slot?: string;
    notes?: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition on mount if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / Hindi-English mix

      recognition.onstart = () => {
        setStatus('listening');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript;
            setUserTranscript(finalTranscript);
            handleSendToAI(finalTranscript);
          } else {
            interim += event.results[i][0].transcript;
            setUserTranscript(interim);
          }
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        if (status === 'listening') setStatus('idle');
      };

      recognition.onend = () => {
        if (status === 'listening') {
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
    } else {
      setHasSpeechRecognition(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleToggleListening = () => {
    if (status === 'listening') {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore
      }
      setStatus('idle');
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setUserTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn('Could not start recognition:', e);
        // Fallback prompt simulation
        handleSimulatedVoiceInput('Please guide me about my career and suggested gemstone');
      }
    }
  };

  const handleSimulatedVoiceInput = (sampleText: string) => {
    setUserTranscript(sampleText);
    handleSendToAI(sampleText);
  };

  const handleSendToAI = async (message: string) => {
    if (!message.trim()) return;

    setStatus('thinking');

    try {
      // 1. Fetch AI reply from server
      const chatRes = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!chatRes.ok) throw new Error('Chat API failed');
      const chatData = await chatRes.json();
      const reply = chatData.reply || 'Pranam. May auspicious energies guide your endeavors.';
      setAiResponseText(reply);

      // Check if message relates to consultation or pooja for automated action suggestion
      const lower = message.toLowerCase();
      if (lower.includes('kundli') || lower.includes('chart') || lower.includes('birth')) {
        setRecognizedSuggestion({
          service: 'Kundli Vishleshan (Full Chart Analysis)',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          slot: '17:00',
          notes: `Spoken inquiry: ${message}`,
        });
      } else if (lower.includes('marriage') || lower.includes('milan') || lower.includes('shaadi')) {
        setRecognizedSuggestion({
          service: 'Matchmaking (Kundli Milan)',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          slot: '18:15',
          notes: `Spoken inquiry: ${message}`,
        });
      } else if (lower.includes('pooja') || lower.includes('shanti') || lower.includes('dosh')) {
        setRecognizedSuggestion({
          service: 'Navagraha Shanti Pooja',
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          slot: '16:00',
          notes: `Spoken inquiry: ${message}`,
        });
      }

      // 2. Synthesize Real Spoken Voice Audio via Gemini TTS
      if (!isMuted) {
        setStatus('speaking');
        try {
          const voiceRes = await fetch('/api/ai/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: reply.slice(0, 350),
              voiceName: selectedVoice,
            }),
          });

          if (voiceRes.ok) {
            const voiceData = await voiceRes.json();
            if (voiceData.audioBase64) {
              const audioSrc = `data:${voiceData.mimeType || 'audio/wav'};base64,${voiceData.audioBase64}`;
              const audio = new Audio(audioSrc);
              audioRef.current = audio;

              audio.onended = () => {
                setStatus('idle');
              };
              audio.onerror = () => {
                fallbackBrowserSpeak(reply);
              };

              await audio.play();
              return;
            }
          }
        } catch (voiceErr) {
          console.warn('Gemini voice playback notice:', voiceErr);
        }

        // Fallback to Web Speech Synthesis if TTS endpoint unavailable
        fallbackBrowserSpeak(reply);
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('AI Voice interaction error:', err);
      setStatus('idle');
      setAiResponseText('ॐ नमः शिवाय। The cosmos is listening. Please share your birth date or astrological question.');
    }
  };

  const fallbackBrowserSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setStatus('idle');
      utterance.onerror = () => setStatus('idle');
      window.speechSynthesis.speak(utterance);
    } else {
      setStatus('idle');
    }
  };

  const handleApplySuggestion = () => {
    if (recognizedSuggestion && onApplyBooking) {
      onApplyBooking(
        recognizedSuggestion.service,
        recognizedSuggestion.date || '',
        recognizedSuggestion.slot || '17:00',
        recognizedSuggestion.notes || ''
      );
      onClose();
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-amber-500/40 shadow-2xl p-6 sm:p-8 text-white flex flex-col items-center justify-between min-h-[580px] overflow-hidden">
        {/* Sacred ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="w-full flex items-center justify-between z-10 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xs font-bold">
              🕉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Live AI Voice Guide
                </h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                  Gemini Live Audio
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Spoken Vedic Guidance with {ASTROLOGER.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
              title="Close Voice Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Glowing Interactive Voice Orb */}
        <div className="my-auto py-6 flex flex-col items-center justify-center z-10 text-center">
          <div className="relative flex items-center justify-center mb-6">
            {/* Animated pulsating waves when speaking or listening */}
            {(status === 'listening' || status === 'speaking' || status === 'thinking') && (
              <>
                <div
                  className={`absolute w-44 h-44 rounded-full border-2 animate-ping opacity-35 ${
                    status === 'speaking'
                      ? 'border-emerald-400'
                      : status === 'listening'
                      ? 'border-amber-400'
                      : 'border-blue-400'
                  }`}
                />
                <div
                  className={`absolute w-36 h-36 rounded-full border opacity-50 ${
                    status === 'speaking'
                      ? 'border-emerald-300 bg-emerald-500/10'
                      : status === 'listening'
                      ? 'border-amber-300 bg-amber-500/10'
                      : 'border-blue-300 bg-blue-500/10'
                  }`}
                />
              </>
            )}

            {/* Central Orb Button */}
            <button
              onClick={handleToggleListening}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
                status === 'listening'
                  ? 'bg-amber-500 text-slate-950 scale-105 shadow-amber-500/50 ring-4 ring-amber-300'
                  : status === 'speaking'
                  ? 'bg-emerald-500 text-slate-950 scale-105 shadow-emerald-500/50 ring-4 ring-emerald-300'
                  : status === 'thinking'
                  ? 'bg-blue-600 text-white animate-pulse shadow-blue-500/50'
                  : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 hover:scale-105 shadow-amber-500/30'
              }`}
            >
              {status === 'listening' ? (
                <>
                  <Mic className="w-8 h-8 animate-bounce mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Listening</span>
                </>
              ) : status === 'speaking' ? (
                <>
                  <Volume2 className="w-8 h-8 animate-pulse mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Speaking</span>
                </>
              ) : status === 'thinking' ? (
                <>
                  <Sparkles className="w-8 h-8 animate-spin mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Reflecting</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tap to Speak</span>
                </>
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="mb-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                status === 'listening'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : status === 'speaking'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : status === 'thinking'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              {status === 'listening'
                ? 'Listening to your voice...'
                : status === 'speaking'
                ? 'Answering with Vedic wisdom...'
                : status === 'thinking'
                ? 'Consulting planetary positions...'
                : 'Tap microphone or pick a topic below'}
            </span>
          </div>

          {/* Live Transcript Display Box */}
          <div className="w-full max-w-md p-4 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2">
            {userTranscript && (
              <div className="text-xs text-amber-300 font-medium">
                <span className="text-slate-400 uppercase text-[10px] block">You:</span>
                &ldquo;{userTranscript}&rdquo;
              </div>
            )}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed max-h-28 overflow-y-auto pr-1">
              <span className="text-emerald-400 uppercase text-[10px] block font-bold">
                Vedic Rishi AI:
              </span>
              {aiResponseText}
            </div>
          </div>

          {/* Automated Action Banner if AI detected specific requirement */}
          {recognizedSuggestion && (
            <div className="mt-3 w-full max-w-md p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-left flex items-center justify-between gap-3 animate-fade-in">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  Automated Requirement Match
                </span>
                <span className="text-xs font-semibold text-white">
                  {recognizedSuggestion.service} ({recognizedSuggestion.date})
                </span>
              </div>
              <button
                onClick={handleApplySuggestion}
                className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition"
              >
                <span>Auto-Fill Booking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="w-full z-10 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0">Ask:</span>
            {[
              'Suggest auspicious Muhurat for Griha Pravesh',
              'Remedies for Shani Sade Sati and Rahu Dosh',
              'Which gemstone should I wear for career?',
              'Explain my Janam Kundli 7th house marriage',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulatedVoiceInput(q)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 shrink-0 transition text-[11px]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Voice Personality Selector */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px]">AI Voice:</span>
            <div className="flex items-center gap-1.5">
              {(['Kore', 'Puck', 'Fenrir', 'Zephyr'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVoice(v)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                    selectedVoice === v
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
