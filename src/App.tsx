/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SiteContentProvider } from './context/SiteContentContext';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { AppointmentSection } from './components/AppointmentSection';
import { LocationSection } from './components/LocationSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ChatAssistant } from './components/ChatAssistant';

function MainLayout() {
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  const handleNavigate = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroAction = (
    target: 'rendez-vous' | 'services' | 'localisation' | 'horaires' | 'avis'
  ) => {
    handleNavigate(target);
  };

  return (
    <div className="relative min-h-screen bg-[#07080a] text-white selection:bg-white selection:text-black">
      {/* 
        FULL-SCREEN BACKGROUND VIDEO:
        - Controlled via horizontal mouse-scrubbing
        - Pristine and immersive background without intrusive toolbars
      */}
      <BackgroundVideo />

      {/* FIXED TOP NAVBAR */}
      <Navbar onNavigate={handleNavigate} />

      {/* FULL-SCREEN HERO SECTION (Creative agency minimalist aesthetic) */}
      <main>
        <Hero onSelectAction={handleHeroAction} />

        {/* MINIMAL CONTENT SECTIONS (Scrollable below hero) */}
        <ServicesSection />
        <AppointmentSection />
        <LocationSection />
        <ReviewsSection />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* OFFICIAL CENTRE AUTO JCR GEMINI CHATBOT (Bottom right) */}
      <ChatAssistant isOpen={chatOpen} onToggle={() => setChatOpen((prev) => !prev)} />
    </div>
  );
}

export default function App() {
  return (
    <SiteContentProvider>
      <MainLayout />
    </SiteContentProvider>
  );
}
