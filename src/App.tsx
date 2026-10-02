/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SiteContentProvider } from './context/SiteContentContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { ServicesBento } from './components/ServicesBento';
import { AboutGarageSection } from './components/AboutGarageSection';
import { ReviewsSection } from './components/ReviewsSection';
import { AppointmentSection } from './components/AppointmentSection';
import { ContactLocationSection } from './components/ContactLocationSection';
import { Footer } from './components/Footer';
import { ChatAssistant } from './components/ChatAssistant';
import { MobileActionBar } from './components/MobileActionBar';

function MainLayout() {
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [selectedServiceForAppointment, setSelectedServiceForAppointment] = useState<string | undefined>(undefined);
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState<boolean>(false);

  const handleNavigate = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroAction = (
    target: 'rendez-vous' | 'services' | 'localisation' | 'horaires' | 'avis'
  ) => {
    if (target === 'localisation') {
      handleNavigate('le-garage');
    } else {
      handleNavigate(target);
    }
  };

  const handleSelectServiceAppointment = (serviceName?: string) => {
    setSelectedServiceForAppointment(serviceName);
    handleNavigate('rendez-vous');
  };

  return (
    <div className="relative min-h-screen bg-[#07080a] text-white selection:bg-white selection:text-black">
      {/* 1. STICKY PROFESSIONAL HEADER (Mobile: 62px compact with quick call & hamburger) */}
      <Navbar onNavigate={handleNavigate} />

      <main>
        {/* 2. COMPACT HERO SECTION (Vertical mobile stack, clamp typography, media card below) */}
        <Hero onSelectAction={handleHeroAction} />

        {/* 3. BANDE DE CONFIANCE (3 verified items, touch-friendly) */}
        <TrustBar onNavigateAvis={() => handleNavigate('avis')} />

        {/* 4. SERVICES EN GRILLE BENTO (Single column on mobile, bottom sheet detail) */}
        <ServicesBento
          onSelectAppointment={handleSelectServiceAppointment}
          onDetailStateChange={setIsServiceDetailOpen}
        />

        {/* 5. PRÉSENTATION DU GARAGE : CENTRE AUTO JCR */}
        <AboutGarageSection onNavigateContact={() => handleNavigate('le-garage')} />

        {/* 6. AVIS CLIENTS CERTIFIÉS (Touch scroll-snap carousel on mobile) */}
        <ReviewsSection onNavigateAppointment={() => handleNavigate('rendez-vous')} />

        {/* 7. PRISE DE RENDEZ-VOUS (16px inputs, single-column mobile form, touch RGPD checkbox) */}
        <AppointmentSection initialServiceName={selectedServiceForAppointment} />

        {/* 8. HORAIRES D'OUVERTURE DE L'ATELIER */}
        <ContactLocationSection onNavigateAppointment={() => handleNavigate('rendez-vous')} />
      </main>

      {/* 9. FOOTER MINIMALISTE (Vertical mobile stack with clearance for action bar) */}
      <Footer onNavigate={handleNavigate} />

      {/* 10. ASSISTANT JCR (Gemini Chatbot, safe-area positioning above mobile bar) */}
      <ChatAssistant
        isOpen={chatOpen}
        onToggle={() => setChatOpen((prev) => !prev)}
        isHidden={isServiceDetailOpen}
      />

      {/* 11. MOBILE BOTTOM ACTION BAR (Strictly mobile only, auto-hides when chat is open) */}
      <MobileActionBar
        onNavigateAppointment={() => handleNavigate('rendez-vous')}
        isChatOpen={chatOpen}
      />
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
