import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const ContactLocationSection: React.FC = () => {
  const { content } = useSiteContent();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${content.brandName} ${content.addressLine1} ${content.addressLine2} ${content.addressLine3}`
  )}`;

  return (
    <section id="contact" className="relative z-10 py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#090a0e]">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-white/50 mb-2.5 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span>Informations pratiques</span>
          </div>

          <h2
            className="text-[26px] sm:text-[38px] lg:text-[44px] font-semibold text-white tracking-[-0.03em] leading-tight mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Horaires, localisation & contact
          </h2>

          <p className="text-[14.5px] sm:text-[17px] text-white/65 font-light leading-relaxed">
            Retrouvez toutes les coordonnées utiles pour vous rendre à l’atelier ou contacter notre équipe mécanique à Bastia.
          </p>
        </div>

        {/* 3 VERTICAL CARDS (Single column mobile, 3-cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* TILE 1: TÉLÉPHONE DIRECT (Prioritized on mobile) */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#0f1117] border border-white/[0.08] p-5 sm:p-7 lg:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-200 shadow-lg">
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-4 sm:mb-6 flex-shrink-0">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>

              <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">
                Ligne directe atelier
              </span>
              <h3
                className="text-[20px] sm:text-[22px] font-medium text-white tracking-tight mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Téléphone
              </h3>

              <p className="text-[14px] text-white/60 font-light leading-relaxed mb-4 sm:mb-6">
                Pour une urgence mécanique, un renseignement ou suivre l’état de votre véhicule :
              </p>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-5">
                <span className="text-[11px] text-white/40 block mb-1">Appel direct</span>
                <a
                  href={`tel:${content.phone}`}
                  className="text-[22px] sm:text-[26px] font-mono font-medium text-white hover:underline block leading-tight tracking-tight"
                >
                  {content.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08]">
              <a
                href={`tel:${content.phone}`}
                className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 bg-white text-black active:bg-neutral-200 text-[14.5px] font-semibold py-3 px-5 rounded-full transition-colors cursor-pointer shadow-md"
              >
                <Phone className="w-4 h-4 text-black" />
                <span>Appeler l’atelier</span>
              </a>
            </div>
          </div>

          {/* TILE 2: ADRESSE & LOCALISATION */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#0f1117] border border-white/[0.08] p-5 sm:p-7 lg:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-200 shadow-lg">
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-4 sm:mb-6 flex-shrink-0">
                <MapPin className="w-5 h-5 text-white/90" />
              </div>

              <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">
                Atelier Bastia
              </span>
              <h3
                className="text-[20px] sm:text-[22px] font-medium text-white tracking-tight mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Localisation
              </h3>

              <address className="not-italic text-[14.5px] sm:text-[15.5px] text-white/80 font-light leading-relaxed mb-4 sm:mb-6 space-y-0.5">
                <p>{content.addressLine1}</p>
                <p>{content.addressLine2}</p>
                <p className="font-medium text-white">{content.addressLine3}</p>
              </address>
            </div>

            <div className="pt-3 border-t border-white/[0.08]">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 bg-white/10 active:bg-white/20 border border-white/15 text-white text-[14px] font-medium py-3 px-5 rounded-full transition-colors cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Nous trouver (Google Maps)</span>
              </a>
            </div>
          </div>

          {/* TILE 3: HORAIRES D'OUVERTURE */}
          <div
            id="horaires"
            className="scroll-mt-20 sm:scroll-mt-24 rounded-2xl sm:rounded-3xl bg-[#0f1117] border border-white/[0.08] p-5 sm:p-7 lg:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-200 shadow-lg"
          >
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-4 sm:mb-6 flex-shrink-0">
                <Clock className="w-5 h-5 text-white/90" />
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-[20px] sm:text-[22px] font-medium text-white tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Horaires d’ouverture
                </h3>
                <span className="text-[10.5px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full font-medium">
                  Semaine
                </span>
              </div>

              {/* Day rows */}
              <div className="divide-y divide-white/[0.06] text-[13px] sm:text-[14px] mb-3">
                {content.openingHours.map((item) => (
                  <div key={item.day} className="py-1.5 flex justify-between items-center">
                    <span className="text-white/70">{item.day}</span>
                    <span
                      className={`font-mono text-xs ${
                        item.open ? 'text-white' : 'text-white/35'
                      }`}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08]">
              <p className="text-[11px] sm:text-[11.5px] text-white/45 leading-snug">
                {content.hoursNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
