import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { EditableText } from './EditableText';

interface NavbarProps {
  onNavigate?: (targetId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { content, updateField } = useSiteContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* 
        NAVBAR:
        Fixed at the top, full width, z-index: 10.
        px-5 sm:px-8 py-4 sm:py-5
        flex justify-between items-center
      */}
      <header className="fixed top-0 left-0 w-full z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center bg-gradient-to-b from-black/50 via-black/20 to-transparent">
        {/* LOGO — LEFT */}
        <div className="flex items-center gap-3 group">
          <EditableText
            as="span"
            value={content.brandName}
            onChange={(val) => updateField('brandName', val)}
            className="text-[21px] sm:text-[26px] tracking-tight text-white cursor-pointer"
            style={{ fontFamily: 'var(--font-heading)' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <span
            className="text-[25px] sm:text-[30px] text-white select-none leading-none transform group-hover:rotate-45 transition-transform duration-300"
            style={{ letterSpacing: '-0.02em' }}
            aria-hidden="true"
          >
            ✳︎
          </span>
        </div>

        {/* GOOGLE REVIEWS SHORTCUT — CENTER (Replaces previous text links) */}
        <nav
          className="hidden md:flex items-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <a
            href="#avis"
            onClick={(e) => handleNavClick('avis', e)}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 backdrop-blur-md transition-all text-[16px] text-white tracking-normal group cursor-pointer shadow-sm hover:shadow"
            title="Consulter nos avis clients vérifiés sur Google"
          >
            <span className="text-amber-400 select-none text-[15px] leading-none group-hover:scale-105 transition-transform" aria-label="5 étoiles">
              ⭐⭐⭐⭐⭐
            </span>
            <span className="font-semibold text-white tracking-tight">4,8/5</span>
            <span className="text-white/70 group-hover:text-white transition-colors">
              sur Google
            </span>
          </a>
        </nav>

        {/* DESKTOP CTA — RIGHT (Hidden below md) */}
        <div className="hidden md:flex items-center gap-4">
          <EditableText
            as="a"
            href={`tel:${content.phone}`}
            value={content.phoneDisplay}
            onChange={(val) => {
              updateField('phoneDisplay', val);
              updateField('phone', val.replace(/\s+/g, ''));
            }}
            className="text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity whitespace-nowrap"
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </div>

        {/* MOBILE HAMBURGER (Visible below md) */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 p-2 cursor-pointer z-20 focus:outline-none"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {/* Top bar: rotate 45deg translate down 7px */}
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            {/* Middle bar: opacity 0 */}
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Bottom bar: rotate -45deg translate up 7px */}
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={`md:hidden fixed inset-0 z-[9] bg-black/95 backdrop-blur-md flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <a
          href="#services"
          onClick={(e) => handleNavClick('services', e)}
          className="text-[30px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Services
        </a>
        <a
          href="#rendez-vous"
          onClick={(e) => handleNavClick('rendez-vous', e)}
          className="text-[30px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Prendre rendez-vous
        </a>
        <a
          href="#localisation"
          onClick={(e) => handleNavClick('localisation', e)}
          className="text-[30px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Localisation & Horaires
        </a>
        <a
          href="#avis"
          onClick={(e) => handleNavClick('avis', e)}
          className="text-[30px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Nos avis clients
        </a>

        <div className="pt-4 border-t border-white/20 w-full flex flex-col gap-4">
          <a
            href={`tel:${content.phone}`}
            className="text-[32px] font-medium text-white underline underline-offset-4 hover:opacity-60 transition-opacity"
          >
            {content.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  );
};
