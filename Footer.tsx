import React from 'react';
import { Moon, ArrowUp, Phone, Mail, MapPin, Smartphone, FileArchive } from 'lucide-react';
import { ASTROLOGER } from '../data/vedicData';
import { downloadAndroidApp, downloadRealZip } from '../utils/downloader';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black/90 border-t border-white/10 text-slate-400 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                <Moon className="w-5 h-5 fill-yellow-400/30" />
              </div>
              <div>
                <span className="font-cinzel text-xl font-bold text-white tracking-wider">
                  {ASTROLOGER.brandName}
                </span>
                <div className="text-[11px] text-yellow-400 font-semibold tracking-widest uppercase">
                  {ASTROLOGER.name}
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Authentic Vedic astrology, tantric dosh nivaran, certified gemstones, and traditional rituals conducted according to classical sanatana scriptures.
            </p>

            <div className="flex items-center gap-4 text-xs text-yellow-400 font-semibold">
              <span>✦ 28+ Years Experience</span>
              <span>✦ 3200+ Consultations</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#home" className="hover:text-yellow-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-yellow-400 transition-colors">
                  About Acharya Ji
                </a>
              </li>
              <li>
                <a href="#specialties" className="hover:text-yellow-400 transition-colors">
                  Specialties
                </a>
              </li>
              <li>
                <a href="#horoscope" className="hover:text-yellow-400 transition-colors">
                  Daily Vedic Horoscope
                </a>
              </li>
              <li>
                <a href="#pooja" className="hover:text-yellow-400 transition-colors">
                  Vedic Pooja
                </a>
              </li>
              <li>
                <a href="#yagya" className="hover:text-yellow-400 transition-colors">
                  Yagya &amp; Rituals
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-yellow-400 transition-colors">
                  Astrology Services
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contacts */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
              Consultation Desk
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <a
                href={`tel:${ASTROLOGER.contact.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-yellow-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-yellow-400" />
                <span>{ASTROLOGER.contact.phone}</span>
              </a>
              <a
                href={`mailto:${ASTROLOGER.contact.email}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-yellow-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>{ASTROLOGER.contact.email}</span>
              </a>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span>{ASTROLOGER.contact.location}</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs text-slate-400">Hours:</div>
              <div className="text-xs text-yellow-400 font-medium">
                Mon-Sat: 4 PM - 8 PM | Sun: 10 AM - 5 PM
              </div>
            </div>
          </div>
        </div>

        {/* Offline App & Real ZIP Download Banner in Footer */}
        <div className="py-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
              <FileArchive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white text-xs font-semibold">Offline App &amp; Real ZIP Package</div>
              <div className="text-slate-400 text-[11px]">Install on Android or run 100% offline on any phone or computer without internet</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={downloadAndroidApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              title="Download Single HTML Android App"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android App (.html)</span>
            </button>
            <button
              onClick={downloadRealZip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-400/40 text-yellow-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(250,204,21,0.15)]"
              title="Download Real ZIP Package of Vedic Pandit"
            >
              <FileArchive className="w-3.5 h-3.5 text-yellow-400" />
              <span>Download Real ZIP (.zip)</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar with required copyright & exact tagline */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              &copy; 2026 Vedic Pandit — Acharya Jitender Shastri. All rights reserved.
            </p>
            <p className="text-xs text-yellow-400/90 mt-1">
              {ASTROLOGER.tagline}
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 p-2.5 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black text-yellow-400 border border-white/20 transition-all active:scale-95 text-xs font-semibold"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
