import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface NavbarProps {
  onNavigate: (targetId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { content } = useSiteContent();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090a0d]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/50'
          : 'bg-[#07080a]/70 backdrop-blur-md border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[62px] sm:h-[72px] lg:h-[78px] flex items-center justify-between">
        {/* BRAND WORDMARK (Compact & responsive on mobile) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer max-w-[200px] sm:max-w-none"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white text-[13px] sm:text-[15px] font-semibold transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
            <span>✳</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-[16px] sm:text-[19px] tracking-tight text-white font-medium leading-none truncate"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {content.brandName}
            </span>
            <span className="text-[10px] sm:text-[11px] text-white/50 tracking-wider uppercase mt-0.5 truncate">
              Bastia · Atelier Auto
            </span>
          </div>
        </a>

        {/* DESKTOP NAVIGATION LINKS (Hidden on mobile & tablet) */}
        <nav className="hidden lg:flex items-center gap-8 text-[14.5px] text-white/70">
          <a
            href="#services"
            onClick={(e) => handleLinkClick('services', e)}
            className="hover:text-white transition-colors duration-200"
          >
            Services
          </a>
          <a
            href="#le-garage"
            onClick={(e) => handleLinkClick('le-garage', e)}
            className="hover:text-white transition-colors duration-200"
          >
            Le garage
          </a>
          <a
            href="#avis"
            onClick={(e) => handleLinkClick('avis', e)}
            className="hover:text-white transition-colors duration-200"
          >
            Avis
          </a>
          <a
            href="#horaires"
            onClick={(e) => handleLinkClick('horaires', e)}
            className="hover:text-white transition-colors duration-200"
          >
            Horaires
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLinkClick('contact', e)}
            className="hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          <a
            href={`tel:${content.phone}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[13.5px] lg:text-[14px] px-3 py-1.5 rounded-full hover:bg-white/5 transition-all duration-200 font-mono tracking-tight"
            title="Appeler directement l’atelier"
          >
            <Phone className="w-3.5 h-3.5 text-white/60" />
            <span>{content.phoneDisplay}</span>
          </a>

          <a
            href="#rendez-vous"
            onClick={(e) => handleLinkClick('rendez-vous', e)}
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 font-medium text-[13px] lg:text-[13.5px] px-4 py-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Prendre rendez-vous</span>
          </a>
        </div>

        {/* MOBILE HEADER ACTIONS: CALL BUTTON + HAMBURGER (Strictly >= 44x44px touch targets) */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Quick Direct Call Button */}
          <a
            href={`tel:${content.phone}`}
            className="w-11 h-11 rounded-full bg-white/10 active:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Appeler le Centre Auto JCR"
            title={`Appeler : ${content.phoneDisplay}`}
          >
            <Phone className="w-4 h-4 text-emerald-400" />
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-11 h-11 rounded-full bg-white/10 active:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer focus:outline-none"
            aria-label={mobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE FULL-SCREEN MENU DRAWER (Thumb-friendly, 48px+ touch targets) */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="sm:hidden fixed inset-x-0 top-[62px] h-[calc(100dvh-62px)] bg-[#07080a]/98 backdrop-blur-2xl z-50 px-5 py-6 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200 safe-area-bottom"
        >
          {/* NAVIGATION LINKS */}
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wider text-white/40 mb-3 px-1">
              Menu atelier
            </p>

            <a
              href="#services"
              onClick={(e) => handleLinkClick('services', e)}
              className="flex items-center justify-between min-h-[52px] py-3.5 px-3 rounded-2xl active:bg-white/10 text-[18px] font-medium text-white border-b border-white/[0.06] transition-colors"
            >
              <span>Services & Prestations</span>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </a>

            <a
              href="#le-garage"
              onClick={(e) => handleLinkClick('le-garage', e)}
              className="flex items-center justify-between min-h-[52px] py-3.5 px-3 rounded-2xl active:bg-white/10 text-[18px] font-medium text-white border-b border-white/[0.06] transition-colors"
            >
              <span>Le garage</span>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </a>

            <a
              href="#avis"
              onClick={(e) => handleLinkClick('avis', e)}
              className="flex items-center justify-between min-h-[52px] py-3.5 px-3 rounded-2xl active:bg-white/10 text-[18px] font-medium text-white border-b border-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>Avis clients</span>
                <span className="text-amber-400 text-xs font-mono">★ 4,8/5</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </a>

            <a
              href="#horaires"
              onClick={(e) => handleLinkClick('horaires', e)}
              className="flex items-center justify-between min-h-[52px] py-3.5 px-3 rounded-2xl active:bg-white/10 text-[18px] font-medium text-white border-b border-white/[0.06] transition-colors"
            >
              <span>Horaires d’ouverture</span>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </a>

            <a
              href="#contact"
              onClick={(e) => handleLinkClick('contact', e)}
              className="flex items-center justify-between min-h-[52px] py-3.5 px-3 rounded-2xl active:bg-white/10 text-[18px] font-medium text-white border-b border-white/[0.06] transition-colors"
            >
              <span>Coordonnées & Accès</span>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </a>
          </div>

          {/* QUICK MOBILE ACTIONS IN MENU */}
          <div className="pt-6 space-y-3">
            <a
              href="#rendez-vous"
              onClick={(e) => handleLinkClick('rendez-vous', e)}
              className="w-full min-h-[52px] flex items-center justify-center gap-2.5 bg-white text-black font-semibold text-[15px] px-6 py-3.5 rounded-full shadow-lg active:bg-neutral-200 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Prendre rendez-vous</span>
            </a>

            <a
              href={`tel:${content.phone}`}
              className="w-full min-h-[50px] flex items-center justify-center gap-2.5 bg-white/10 active:bg-white/20 text-white font-medium text-[15px] px-6 py-3 rounded-full border border-white/15 transition-colors font-mono"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Appeler le {content.phoneDisplay}</span>
            </a>

            <p className="text-center text-[12px] text-white/45 pt-1">
              Bastia — Zone industrielle de Furiani
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
