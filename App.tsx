/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Specialties } from './components/Specialties';
import { HoroscopeSection } from './components/HoroscopeSection';
import { VedicPooja } from './components/VedicPooja';
import { YagyaRituals } from './components/YagyaRituals';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CalendarScheduleView } from './components/CalendarScheduleView';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { initAuth, logout, getAccessToken, setCachedAccessToken, testFirestoreConnection } from './lib/firebase';
import { User } from 'firebase/auth';
import { Mic, Sparkles, Zap } from 'lucide-react';

export default function App() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [calendarViewOpen, setCalendarViewOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  useEffect(() => {
    // Validate Firestore connection per system skill
    testFirestoreConnection();

    // Initialize Firebase Auth listener
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        if (token) {
          setAccessToken(token);
        }
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser: User, token: string | null) => {
    setUser(authenticatedUser);
    if (token) {
      setAccessToken(token);
      setCachedAccessToken(token);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <div className="min-h-screen cosmic-gradient cosmic-stars text-slate-100 flex flex-col relative selection:bg-yellow-400 selection:text-black">
      {/* Fixed Navigation Header */}
      <Navbar
        user={user}
        accessToken={accessToken}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenCalendarView={() => setCalendarViewOpen(true)}
        onOpenVoiceGuide={() => setVoiceModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero onOpenVoiceGuide={() => setVoiceModalOpen(true)} />

        {/* 2. About Section */}
        <About />

        {/* 3. Specialties Section (bg-black/20) */}
        <Specialties />

        {/* 4. Interactive Daily Horoscope Section */}
        <HoroscopeSection onSelectService={handleSelectService} />

        {/* 5. Vedic Pooja Section (amber/purple gradient band) */}
        <VedicPooja onSelectService={handleSelectService} />

        {/* 6. Yagya & Hindu Rituals Section */}
        <YagyaRituals onSelectService={handleSelectService} />

        {/* 7. Services Section (bg-black/20) */}
        <Services onSelectService={handleSelectService} />

        {/* 8. Testimonials Section */}
        <Testimonials />

        {/* 9. Dynamic Appointment Booking & Contact Section (bg-black/20) */}
        <Contact
          selectedService={selectedService}
          onServiceChange={setSelectedService}
          accessToken={accessToken}
          currentUser={user}
          onOpenCalendarView={() => setCalendarViewOpen(true)}
          onConnectGoogle={() => handleOpenAuth('signin')}
          onOpenVoiceGuide={() => setVoiceModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Floating AI Guide & Voice Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setVoiceModalOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300/60"
          title="Talk with Live AI Voice Guide (ChatGPT-Style Voice Mode)"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center">
            <Mic className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
          </div>
          <span className="tracking-wide">Talk to Live AI Voice</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
        </button>
      </div>

      {/* Live AI Voice Modal (ChatGPT-Style Voice Interaction) */}
      <LiveVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onApplyBooking={(service, date, slot, notes) => {
          setSelectedService(service);
          setVoiceModalOpen(false);
          const contactEl = document.getElementById('contact');
          if (contactEl) {
            contactEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Real Auth Modal (Login / Sign Up / Google Workspace Sync) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />

      {/* Calendar View & Schedule Management Modal */}
      {calendarViewOpen && (
        <CalendarScheduleView
          accessToken={accessToken}
          onClose={() => setCalendarViewOpen(false)}
          onConnectGoogle={() => {
            setCalendarViewOpen(false);
            handleOpenAuth('signin');
          }}
        />
      )}
    </div>
  );
}
