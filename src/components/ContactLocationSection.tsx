import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ContactLocationSectionProps {
  onNavigateAppointment?: () => void;
}

export const ContactLocationSection: React.FC<ContactLocationSectionProps> = ({
  onNavigateAppointment,
}) => {
  const { content } = useSiteContent();

  return (
    <section id="contact" className="relative z-10 py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#090a0e]">
      <div id="horaires" className="max-w-3xl mx-auto scroll-mt-20 sm:scroll-mt-24">
        {/* SECTION HEADER */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-white/50 mb-2.5 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span>Disponibilités atelier</span>
          </div>

          <h2
            className="text-[26px] sm:text-[38px] lg:text-[44px] font-semibold text-white tracking-[-0.03em] leading-tight mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Horaires d’ouverture
          </h2>

          <p className="text-[14.5px] sm:text-[16.5px] text-white/65 font-light leading-relaxed max-w-xl mx-auto">
            Notre équipe vous accueille à Furiani pour l’entretien et la prise en charge de votre véhicule.
          </p>
        </div>

        {/* SINGLE HORAIRES CARD */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#0f1117] border border-white/[0.08] p-5 sm:p-8 lg:p-9 shadow-xl sm:shadow-2xl">
          <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3
                  className="text-[18px] sm:text-[21px] font-medium text-white tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Semaine & week-end
                </h3>
                <span className="text-[11px] sm:text-xs text-white/50">Atelier mécanique · Bastia</span>
              </div>
            </div>

            <span className="text-[11px] sm:text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full font-medium">
              Ouvert du lundi au vendredi
            </span>
          </div>

          {/* Day rows */}
          <div className="divide-y divide-white/[0.06] text-[13.5px] sm:text-[14.5px] mb-6">
            {content.openingHours.map((item) => (
              <div key={item.day} className="py-2.5 flex justify-between items-center">
                <span className="text-white/80 font-medium">{item.day}</span>
                <span
                  className={`font-mono text-xs sm:text-[13px] ${
                    item.open ? 'text-white' : 'text-white/35'
                  }`}
                >
                  {item.hours}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] sm:text-xs text-white/50">
            <p className="leading-snug">{content.hoursNote}</p>
            <a
              href="#rendez-vous"
              onClick={(e) => {
                if (onNavigateAppointment) {
                  e.preventDefault();
                  onNavigateAppointment();
                }
              }}
              className="inline-flex items-center gap-1.5 text-white hover:text-white/80 font-medium underline underline-offset-4 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prendre rendez-vous en ligne</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
