import React, { useState, useEffect, useRef } from 'react';
import { Eye, ShieldCheck, Sparkles, X, Camera, Lock } from 'lucide-react';
import { ASTROLOGER } from '../data/vedicData';

interface PanditPortraitProps {
  className?: string;
  size?: 'small' | 'normal' | 'large';
  showControls?: boolean;
}

const SERVER_PORTRAIT_URLS = [
  '/astrologer_portrait.jpg',
  '/Screenshot 2026-10-14 at 10.39.17 PM.png',
  '/astrologer_portrait.png',
  'astrologer_portrait.jpg',
  'Screenshot 2026-10-14 at 10.39.17 PM.png',
];

export const PanditPortrait: React.FC<PanditPortraitProps> = ({
  className = '',
  size = 'normal',
  showControls = true,
}) => {
  const [photoData, setPhotoData] = useState<string | null>(() => {
    try {
      return localStorage.getItem('acharya_jitender_permanent_photo') || null;
    } catch {
      return null;
    }
  });
  const [urlIndex, setUrlIndex] = useState(0);
  const [serverImgFailed, setServerImgFailed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(() => {
    try {
      return !!localStorage.getItem('acharya_jitender_permanent_photo');
    } catch {
      return false;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if server image exists on mount
  useEffect(() => {
    if (!photoData && !serverImgFailed && urlIndex < SERVER_PORTRAIT_URLS.length) {
      const img = new Image();
      img.src = SERVER_PORTRAIT_URLS[urlIndex];
      img.onload = () => {
        setPhotoData(SERVER_PORTRAIT_URLS[urlIndex]);
        setIsLocked(true);
      };
      img.onerror = () => {
        if (urlIndex + 1 < SERVER_PORTRAIT_URLS.length) {
          setUrlIndex(urlIndex + 1);
        } else {
          setServerImgFailed(true);
        }
      };
    }
  }, [urlIndex, photoData, serverImgFailed]);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPhotoData(dataUrl);
        setIsLocked(true);
        try {
          localStorage.setItem('acharya_jitender_permanent_photo', dataUrl);
        } catch {
          // ignore quota
        }

        // Post to backend server to persist permanently to filesystem
        fetch('/api/upload-permanent-portrait', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl }),
        }).catch((err) => console.log('Portrait sync:', err));
      }
    };
    reader.readAsDataURL(file);
  };

  // Dimensions based on size prop - large, perfectly round circle
  const sizeClasses = {
    small: 'h-44 w-44 sm:h-52 sm:w-52',
    normal: 'h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80',
    large: 'h-72 w-72 sm:h-84 sm:w-84 md:h-96 md:w-96',
  }[size];

  const hasPhoto = Boolean(photoData);

  return (
    <>
      <div className={`relative group inline-block text-center select-none ${className}`}>
        {/* Subtle warm halo aura */}
        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-full blur-md opacity-35 group-hover:opacity-60 transition duration-500 pointer-events-none" />

        {/* 
          Main Circular Astrologer Photo Frame:
          - Permanent, locked official photo of Acharya Jitender Shastri
          - Solid radiant golden yellow border [5px to 6px]
          - Clean, unobstructed view of face, smile, rudraksha mala, angavastram & sea
          - No removable or changeable controls once locked
        */}
        <div
          onClick={() => {
            if (hasPhoto) {
              setModalOpen(true);
            } else {
              fileInputRef.current?.click();
            }
          }}
          className={`relative ${sizeClasses} rounded-full border-[5px] sm:border-[6px] border-[#facc15] shadow-[0_0_35px_rgba(250,204,21,0.35)] overflow-hidden bg-[#2a1b4e] transition-all cursor-pointer hover:scale-[1.015]`}
          title={
            hasPhoto
              ? 'Acharya Jitender Shastri — Official Astrologer Portrait (Click for full darshan)'
              : 'Click to select Screenshot 2026-10-14 at 10.39.17 PM.png to lock as permanent astrologer photo'
          }
        >
          {hasPhoto ? (
            <img
              src={photoData!}
              alt="Acharya Jitender Shastri — Astrologer, Tantra Samrat & Gem Consultant"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#2e1d52] to-[#1a1033] text-center text-amber-200">
              <Camera className="w-10 h-10 text-yellow-400 mb-2 animate-pulse" />
              <div className="font-cinzel text-xs font-bold text-yellow-300 tracking-wide uppercase mb-1">
                Acharya Jitender Shastri
              </div>
              <div className="text-[11px] text-slate-300 font-medium leading-tight max-w-[200px]">
                Click once to lock your photo
                <span className="block text-yellow-400 font-semibold mt-0.5 text-[10px]">
                  (Screenshot 2026-10-14 at 10.39.17 PM.png)
                </span>
                permanently into this app
              </div>
              <div className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-slate-950 font-bold text-[11px] rounded-full shadow-md">
                <Lock className="w-3 h-3" />
                <span>Lock Photo Permanently</span>
              </div>
            </div>
          )}

          {/* Hidden file input for initial one-time permanent locking */}
          {!isLocked && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />
          )}
        </div>

        {/* Permanent Badges & Darshan View - No changeable controls */}
        {showControls && (
          <div className="mt-3.5 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (hasPhoto) {
                    setModalOpen(true);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/35 text-xs font-medium transition-colors shadow-sm"
                title="View full size photo and blessings"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Darshan</span>
              </button>
            </div>

            {/* Permanent Official Astrologer Photo Indicator */}
            <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Astrologer Photo • Permanent &amp; Locked</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Resolution Portrait Modal - Purely Viewing & Darshan, No Changeable Controls */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 border border-yellow-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full border-[5px] sm:border-[6px] border-[#facc15] shadow-[0_0_35px_rgba(250,204,21,0.4)] overflow-hidden bg-[#2a1b4e] mb-5">
                {photoData ? (
                  <img
                    src={photoData}
                    alt="Acharya Jitender Shastri"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-yellow-300">
                    <ShieldCheck className="w-16 h-16" />
                  </div>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 text-xs font-semibold mb-2">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span>Verified Astrologer Photo • Permanent &amp; Non-Removable</span>
              </div>

              <h3 className="font-cinzel text-2xl font-bold text-white mb-1">
                {ASTROLOGER.name}
              </h3>
              <p className="text-yellow-400 text-xs sm:text-sm font-medium tracking-wide uppercase mb-3">
                {ASTROLOGER.titles}
              </p>

              <p className="text-slate-300 text-sm leading-relaxed max-w-md mb-6">
                Acharya Jitender Shastri in sacred traditional attire. With over 28 years of authentic Vedic expertise in Janma Kundali analysis, Tantric Shanti pooja, and certified gemstone consultations.
              </p>

              <div className="flex items-center gap-3 w-full">
                <a
                  href="#contact"
                  onClick={() => setModalOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm transition-transform active:scale-95 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book Janma Kundali Review</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
