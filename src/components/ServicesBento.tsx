import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Cog,
  Cpu,
  Disc,
  CircleDot,
  RotateCw,
  Wind,
  ArrowRight,
  X,
  Phone,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useSiteContent, ServiceItem } from '../context/SiteContentContext';

interface ServicesBentoProps {
  onSelectAppointment: (serviceName?: string) => void;
  onDetailStateChange?: (isOpen: boolean) => void;
}

interface ServiceDetail extends ServiceItem {
  icon: React.ComponentType<{ className?: string }>;
  shortPhrase: string;
  bullets: string[];
  gridSpan: string;
  badge?: string;
  isMainHero?: boolean;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({
  onSelectAppointment,
  onDetailStateChange,
}) => {
  const { content } = useSiteContent();
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  // Prevent body scroll and notify parent to hide/show chatbot
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
      onDetailStateChange?.(true);
    } else {
      document.body.style.overflow = '';
      onDetailStateChange?.(false);
    }
    return () => {
      document.body.style.overflow = '';
      onDetailStateChange?.(false);
    };
  }, [selectedService, onDetailStateChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedService) {
        setSelectedService(null);
        onDetailStateChange?.(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedService, onDetailStateChange]);

  const bentoServices: ServiceDetail[] = [
    {
      id: 'entretien',
      num: '01',
      name: 'Entretien automobile',
      shortPhrase: 'Vidange, révision constructeur et contrôles préventifs.',
      description:
        'Vidange moteur, révision constructeur, remplacement des filtres (huile, air, habitacle) et vérification complète des points de sécurité.',
      icon: Wrench,
      gridSpan: 'lg:col-span-8',
      badge: 'Recommandé régulièrement',
      isMainHero: true,
      bullets: [
        'Vidange avec huile certifiée constructeur',
        'Remplacement des filtres (huile, air, habitacle, carburant)',
        'Remise à zéro du témoin de révision',
        'Contrôle préventif des niveaux et organes de sécurité',
      ],
    },
    {
      id: 'diagnostic',
      num: '02',
      name: 'Diagnostic électronique',
      shortPhrase: 'Lecture des calculateurs et voyants moteur.',
      description:
        'Recherche approfondie de pannes, passage à la valise constructeur, lecture des calculateurs et extinction des voyants d’alerte.',
      icon: Cpu,
      gridSpan: 'lg:col-span-4',
      badge: 'Haute précision',
      bullets: [
        'Lecture des codes défauts calculateurs',
        'Diagnostic moteur, injection et antipollution',
        'Contrôle des capteurs et sondes électroniques',
        'Bilan clair avant toute réparation',
      ],
    },
    {
      id: 'mecanique',
      num: '03',
      name: 'Réparation mécanique',
      shortPhrase: 'Moteur, embrayage, boîte et suspensions.',
      description:
        'Interventions sur moteur, embrayage, volant moteur, boîte de vitesses, suspensions, amortisseurs et trains de roulement.',
      icon: Cog,
      gridSpan: 'lg:col-span-6',
      bullets: [
        'Remplacement embrayage & volant moteur',
        'Suspensions, amortisseurs, triangles & rotules',
        'Système d’échappement et dépollution',
        'Réparation des organes mécaniques d’usure',
      ],
    },
    {
      id: 'distribution',
      num: '04',
      name: 'Kit de distribution',
      shortPhrase: 'Courroie, pompe à eau et accessoires.',
      description:
        'Remplacement préventif ou curatif du kit courroie de distribution, galets tendeurs, pompe à eau et courroie d’accessoires selon préconisations.',
      icon: RotateCw,
      gridSpan: 'lg:col-span-6',
      bullets: [
        'Remplacement courroie crantée et galets',
        'Changement pompe à eau et liquide de refroidissement',
        'Courroie d’accessoires et alternateur',
        'Respect strict des échéances constructeur',
      ],
    },
    {
      id: 'freinage',
      num: '05',
      name: 'Système de freinage',
      shortPhrase: 'Disques, plaquettes et purge liquide.',
      description:
        'Remplacement disques, plaquettes, étriers, purge du liquide de frein et contrôle d’efficacité sur banc.',
      icon: Disc,
      gridSpan: 'lg:col-span-4',
      bullets: [
        'Contrôle d’épaisseur disques et plaquettes',
        'Purge et remplacement liquide de frein',
        'Vérification des flexibles et étriers',
        'Sécurité de freinage optimale',
      ],
    },
    {
      id: 'pneumatiques',
      num: '06',
      name: 'Pneumatiques & Géométrie',
      shortPhrase: 'Montage, équilibrage et parallélisme.',
      description:
        'Fourniture, montage, équilibrage dynamique, contrôle d’usure et réglage du parallélisme des trains roulants.',
      icon: CircleDot,
      gridSpan: 'lg:col-span-4',
      bullets: [
        'Montage et équilibrage haute précision',
        'Contrôle et réglage de la géométrie',
        'Contrôle visuel de la pression et de l’usure',
        'Toutes dimensions et marques disponibles',
      ],
    },
    {
      id: 'climatisation',
      num: '07',
      name: 'Climatisation automobile',
      shortPhrase: 'Recharge gaz et assainissement habitacle.',
      description:
        'Recharge en gaz frigorigène, détection de fuite au traceur, traitement antibactérien de l’habitacle et filtre.',
      icon: Wind,
      gridSpan: 'lg:col-span-4',
      bullets: [
        'Recharge fluide frigorigène (R134a / R1234yf)',
        'Contrôle d’étanchéité du circuit',
        'Désinfection et assainissement habitacle',
        'Remplacement du filtre à pollen',
      ],
    },
  ];

  const handleOpenDetail = (service: ServiceDetail) => {
    setSelectedService(service);
  };

  const handleCloseDetail = () => {
    setSelectedService(null);
  };

  const handleModalAppointment = () => {
    const serviceName = selectedService?.name;
    handleCloseDetail();
    onSelectAppointment(serviceName);
  };

  return (
    <section id="services" className="relative z-10 py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="max-w-3xl mb-8 sm:mb-14">
        <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-white/50 mb-2.5 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <span>Atelier mécanique · Bastia</span>
        </div>
        <h2
          className="text-[26px] sm:text-[38px] lg:text-[46px] font-semibold text-white tracking-[-0.03em] leading-tight mb-3 sm:mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Nos prestations à l’atelier
        </h2>
        <p className="text-[14.5px] sm:text-[17px] text-white/65 leading-relaxed font-light">
          Du simple entretien périodique aux réparations mécaniques les plus poussées, notre atelier à Furiani prend en charge l’ensemble des besoins de votre véhicule.
        </p>
      </div>

      {/* MOBILE-FIRST BENTO GRID */}
      {/* 
        - Single column on smartphone (< sm)
        - 2 columns on tablet (sm:grid-cols-2)
        - 12 columns on desktop (lg:grid-cols-12)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-6">
        {bentoServices.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => handleOpenDetail(service)}
              className={`${service.gridSpan} rounded-2xl sm:rounded-3xl bg-[#0f1117] active:bg-[#141720] hover:bg-[#141720] border border-white/[0.08] hover:border-white/20 p-5 sm:p-7 lg:p-8 flex flex-col justify-between transition-all duration-200 group cursor-pointer shadow-lg active:scale-[0.99] relative overflow-hidden`}
            >
              <div>
                {/* Top bar with icon & num */}
                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.06] group-hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-white/90" />
                  </div>

                  <div className="flex items-center gap-2">
                    {service.badge && (
                      <span className="text-[10.5px] sm:text-[11px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                        {service.badge}
                      </span>
                    )}
                    <span className="text-[12px] sm:text-[13px] font-mono text-white/40">
                      {service.num}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-[18px] sm:text-[21px] lg:text-[23px] font-medium text-white tracking-tight mb-2 group-hover:text-white transition-colors leading-snug"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {service.name}
                </h3>

                {/* Short phrase on mobile, full description on desktop */}
                <p className="text-[13.5px] sm:text-[15px] text-white/60 font-light leading-relaxed mb-4 sm:mb-6">
                  <span className="sm:hidden">{service.shortPhrase}</span>
                  <span className="hidden sm:inline">{service.description}</span>
                </p>
              </div>

              {/* Action Prompt */}
              <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[13px] sm:text-sm text-white/75 group-hover:text-white transition-colors">
                <span className="font-medium">En savoir plus</span>
                <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-all duration-200">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE-ADAPTED BOTTOM SHEET / MODAL */}
      {selectedService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseDetail}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-xl max-h-[85dvh] bg-[#0f1117] border border-white/15 rounded-t-[28px] sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-white relative overflow-y-auto animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 safe-area-bottom"
          >
            {/* Mobile drag pill indicator */}
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4 sm:hidden" />

            {/* Close button (min 44x44px touch target) */}
            <button
              type="button"
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Fermer la fiche prestation"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-4 sm:mb-5 pr-12">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0">
                <selectedService.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-white/50 block">
                  Prestation atelier {selectedService.num}
                </span>
                <h3
                  className="text-[20px] sm:text-[24px] font-semibold text-white tracking-tight leading-snug"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {selectedService.name}
                </h3>
              </div>
            </div>

            {/* Full Description */}
            <p className="text-[14px] sm:text-[15.5px] text-white/70 leading-relaxed mb-5 font-light">
              {selectedService.description}
            </p>

            {/* Bullet Points */}
            <div className="bg-white/[0.04] rounded-2xl p-4 sm:p-5 border border-white/[0.08] mb-6 sm:mb-8">
              <p className="text-[11px] uppercase tracking-wider text-white/50 mb-3 font-medium">
                Détails de l’intervention
              </p>
              <ul className="space-y-2.5 text-[13.5px] sm:text-sm text-white/80">
                {selectedService.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions (Full width on mobile, min 48px height) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleModalAppointment}
                className="min-h-[50px] flex-1 inline-flex items-center justify-center gap-2 bg-white text-black active:bg-neutral-200 font-semibold text-[15px] py-3 px-6 rounded-full transition-colors cursor-pointer shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Prendre rendez-vous</span>
              </button>

              <a
                href={`tel:${content.phone}`}
                className="min-h-[50px] inline-flex items-center justify-center gap-2 bg-white/10 active:bg-white/20 border border-white/15 text-white font-medium text-[15px] py-3 px-6 rounded-full transition-colors font-mono"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Nous appeler</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
