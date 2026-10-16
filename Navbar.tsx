import React, { useState, useEffect } from 'react';
import { Moon, Menu, X, Phone, User as UserIcon, LogOut, Calendar as CalendarIcon, CheckCircle2, Smartphone, FileArchive, Mic } from 'lucide-react';
import { ASTROLOGER } from '../data/vedicData';
import { User } from 'firebase/auth';
import { downloadAndroidApp, downloadRealZip } from '../utils/downloader';

interface NavbarProps {
  user: User | null;
  accessToken: string | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onLogout: () => void;
  onOpenCalendarView: () => void;
  onOpenVoiceGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  accessToken,
  onOpenAuth,
  onLogout,
  onOpenCalendarView,
  onOpenVoiceGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const handleDownloadAndroidApp = downloadAndroidApp;
  const handleDownloadZip = downloadRealZip;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Specialties', href: '#specialties' },
    { name: 'Daily Horoscope', href: '#horoscope' },
    { name: 'Vedic Pooja', href: '#pooja' },
    { name: 'Yagya & Rituals', href: '#yagya' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-md border-b border-white/10 shadow-lg py-2.5'
          : 'bg-black/65 backdrop-blur-md border-b border-white/10 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400/25 transition-colors shadow-[0_0_15px_rgba(250,204,21,0.2)]">
              <Moon className="w-5 h-5 fill-yellow-400/30" />
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-yellow-400 transition-colors">
                {ASTROLOGER.brandName}
              </span>
              <span className="hidden sm:block text-[10px] text-yellow-400 tracking-widest uppercase font-medium">
                {ASTROLOGER.name}
              </span>
            </div>
          </a>

          {/* Desktop Nav links (hidden on mobile) */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-slate-200 hover:text-yellow-400 transition-colors duration-200 relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action: Auth & Quick Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Vedic Pandit App for Android (Downloads Single HTML Standalone App) */}
            <button
              onClick={handleDownloadAndroidApp}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all"
              title="Download Vedic Pandit Android App"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android App</span>
            </button>

            {/* Download Real ZIP package */}
            <button
              onClick={handleDownloadZip}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-yellow-400/40 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-400 hover:text-black transition-all shadow-[0_0_12px_rgba(250,204,21,0.15)]"
              title="Download Real ZIP Package (.zip)"
            >
              <FileArchive className="w-3.5 h-3.5 text-yellow-400" />
              <span>Download ZIP</span>
            </button>

            {/* Live AI Voice Guide (ChatGPT-Style) */}
            <button
              onClick={onOpenVoiceGuide}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
              title="Live AI Voice Guide (ChatGPT-Style Live Conversation)"
            >
              <Mic className="w-3.5 h-3.5 fill-slate-950" />
              <span>Live AI Voice</span>
            </button>

            {/* Calendar quick view button */}
            <button
              onClick={onOpenCalendarView}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                accessToken
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-yellow-400'
              }`}
              title="View Calendar Schedule"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-yellow-400" />
              <span>{accessToken ? 'Calendar Connected' : 'Calendar View'}</span>
            </button>

            {/* User Auth Info / Login button */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/15">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-[10px]">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate text-slate-200 font-medium">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="text-xs font-medium text-slate-200 hover:text-yellow-400 px-2.5 py-1.5 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 hover:bg-yellow-400 hover:text-black px-3 py-1.5 rounded-lg transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}

            <a
              href="#contact"
              className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold px-4 py-2 rounded-lg transition-transform active:scale-95 shadow-md shadow-yellow-400/20 shrink-0"
            >
              Book Slot
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenCalendarView}
              className="p-2 rounded-lg bg-white/10 text-yellow-400"
              title="Calendar"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <a
              href="tel:+919466215390"
              className="p-2 rounded-lg bg-yellow-400/15 text-yellow-400"
              title="Call Acharya ji"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-yellow-400 hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/15 px-6 pt-4 pb-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {/* Mobile Auth Bar */}
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-xs">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {user.displayName || user.email}
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Signed In</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-400 font-semibold px-2 py-1 rounded bg-red-500/10 border border-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => {
                      onOpenAuth('signin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold text-center"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-yellow-400 text-black text-xs font-semibold text-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-200 hover:text-yellow-400 text-base font-medium py-1.5 border-b border-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2.5">
              {/* Live AI Voice Guide Mobile Button */}
              <button
                onClick={() => {
                  if (onOpenVoiceGuide) onOpenVoiceGuide();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Mic className="w-4 h-4 fill-slate-950" />
                <span>🎙️ Talk to Live AI Voice Guide</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleDownloadAndroidApp();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-300 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 hover:bg-emerald-500/25 transition-all"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Android App</span>
                </button>

                <button
                  onClick={() => {
                    handleDownloadZip();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-yellow-300 py-2.5 rounded-xl bg-yellow-500/15 border border-yellow-400/30 hover:bg-yellow-400/25 transition-all"
                >
                  <FileArchive className="w-4 h-4 text-yellow-400" />
                  <span>Download ZIP</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onOpenCalendarView();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-yellow-300 py-2.5 rounded-xl bg-white/10 border border-white/15"
              >
                <CalendarIcon className="w-4 h-4 text-yellow-400" />
                <span>View Scheduled Calendar</span>
              </button>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold py-2.5 rounded-xl shadow-lg shadow-yellow-400/25"
              >
                Book Consultation Slot
              </a>
            </div>
          </div>
        </div>
      )}


    </header>
  );
};
