import React from 'react';
import { ShieldCheck, HeartHandshake, Navigation } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface AboutGarageSectionProps {
  onNavigateContact?: () => void;
}

export const AboutGarageSection: React.FC<AboutGarageSectionProps> = ({ onNavigateContact }) => {
  const { content } = useSiteContent();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${content.brandName} ${content.addressLine1} ${content.addressLine2} ${content.addressLine3}`
  )}`;

  return (
    <section id="le-garage" className="relative z-10 py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#07080a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* LEFT: EDITORIAL COPY */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-white/50 mb-2.5 sm:mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span>L’atelier mécanique</span>
            </div>

            <h2
              className="text-[26px] sm:text-[38px] lg:text-[46px] font-semibold text-white tracking-[-0.03em] leading-tight mb-4 sm:mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Votre garage automobile à Bastia
            </h2>

            <div className="space-y-3.5 text-[15px] sm:text-[17px] text-white/70 font-light leading-relaxed">
              <p>
                Implanté au cœur de la zone industrielle de Furiani à Bastia, <strong className="font-medium text-white">{content.brandName}</strong> accueille les automobilistes pour l’ensemble de leurs besoins d’entretien, de diagnostic et de réparation mécanique.
              </p>
              <p>
                Notre philosophie repose sur une écoute attentive, des explications claires et un diagnostic honnête avant toute intervention sur votre véhicule. Qu’il s’agisse d’une révision de routine, d’un remplacement de pièces d’usure ou d’une recherche de panne complexe, nous prenons en charge votre automobile avec rigueur.
              </p>
            </div>

            {/* Approach Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/[0.08]">
              <div className="flex items-start gap-3 p-3 sm:p-0 rounded-2xl bg-white/[0.02] sm:bg-transparent">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-[14px] sm:text-[14.5px] font-medium text-white mb-0.5">Transparence</h4>
                  <p className="text-[12.5px] sm:text-[13px] text-white/50 leading-snug">
                    Devis et explications limpides avant engagement des travaux.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-0 rounded-2xl bg-white/[0.02] sm:bg-transparent">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-[14px] sm:text-[14.5px] font-medium text-white mb-0.5">Écoute & Proximité</h4>
                  <p className="text-[12.5px] sm:text-[13px] text-white/50 leading-snug">
                    Un atelier local accessible, avec ou sans rendez-vous selon urgence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: STRUCTURED WORKSHOP IDENTITY CARD */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl sm:rounded-3xl bg-[#0f1117] border border-white/[0.08] p-5 sm:p-8 lg:p-9 relative overflow-hidden shadow-xl sm:shadow-2xl">
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-0.5">
                    Atelier Bastia
                  </span>
                  <h3
                    className="text-[20px] sm:text-[23px] font-medium text-white tracking-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {content.brandName}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-amber-400 text-xs sm:text-sm">★★★★★</span>
                  <span className="text-white text-[11px] sm:text-xs block font-mono">4,8 / 5 sur Google</span>
                </div>
              </div>

              {/* Information list */}
              <div className="py-5 space-y-3.5 text-[13.5px] sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                  <span className="text-white/40 text-xs uppercase tracking-wider sm:normal-case sm:text-sm">Localisation</span>
                  <span className="text-white sm:text-right font-light">
                    {content.addressLine1}, {content.addressLine2}, {content.addressLine3}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                  <span className="text-white/40 text-xs uppercase tracking-wider sm:normal-case sm:text-sm">Horaires d’ouverture</span>
                  <span className="text-white sm:text-right font-light">
                    Du lundi au vendredi · 08:30 – 18:30
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                  <span className="text-white/40 text-xs uppercase tracking-wider sm:normal-case sm:text-sm">Interventions</span>
                  <span className="text-white sm:text-right font-light">
                    Mécanique toutes marques, diagnostic, révision
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                  <span className="text-white/40 text-xs uppercase tracking-wider sm:normal-case sm:text-sm">Téléphone atelier</span>
                  <a
                    href={`tel:${content.phone}`}
                    className="text-white underline underline-offset-2 hover:opacity-80 font-mono text-[14px]"
                  >
                    {content.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* Location indication frame with Google Maps */}
              <div className="mt-2 pt-5 border-t border-white/[0.08] rounded-xl sm:rounded-2xl bg-white/[0.02] border border-dashed border-white/10 p-4 text-center">
                <p className="text-[12.5px] sm:text-[13px] text-white/70 font-medium mb-1">
                  Atelier physique situé à Furiani
                </p>
                <p className="text-[11px] sm:text-[11.5px] text-white/40 max-w-sm mx-auto mb-3">
                  Accès facile depuis la voie rapide Bastia — Casamozza. Parking client disponible sur place.
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/15 text-white text-[12.5px] sm:text-[13px] font-medium py-2 px-5 rounded-full transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nous trouver (Google Maps)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
