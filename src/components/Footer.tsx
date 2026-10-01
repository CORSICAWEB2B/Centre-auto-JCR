import React, { useState } from 'react';
import { ArrowUp, Phone, MapPin, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface FooterProps {
  onNavigate?: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { content } = useSiteContent();
  const [legalModalOpen, setLegalModalOpen] = useState<'mentions' | 'rgpd' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 
        Note the pb-24 on mobile: ensures comfortable clearance above the sticky mobile action bar!
      */}
      <footer className="relative z-10 w-full border-t border-white/[0.08] bg-[#050608] text-white/60 text-xs sm:text-sm pt-12 pb-28 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* VERTICAL MOBILE / MULTI-COL DESKTOP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/[0.08]">
            {/* 1. BRAND & COORDONNÉES */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                  ✳
                </div>
                <span
                  className="text-[18px] sm:text-[20px] font-semibold text-white tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {content.brandName}
                </span>
              </div>

              <p className="text-white/60 text-[13.5px] leading-relaxed max-w-sm font-light">
                Atelier automobile indépendant spécialisé en entretien, réparation mécanique et diagnostic électronique à Bastia.
              </p>

              <div className="pt-2 text-[12.5px] sm:text-xs text-white/50 space-y-2">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{content.addressLine1}, {content.addressLine2}, {content.addressLine3}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <a
                    href={`tel:${content.phone}`}
                    className="hover:text-white underline font-mono text-[13.5px] text-white/80"
                  >
                    {content.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>

            {/* 2. NAVIGATION COURTE */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-xs uppercase tracking-wider text-white font-medium block">
                Navigation
              </span>
              <ul className="space-y-2.5 text-[13.5px] sm:text-[13px]">
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleNav('services', e)}
                    className="inline-block py-1 hover:text-white transition-colors"
                  >
                    Services de l’atelier
                  </a>
                </li>
                <li>
                  <a
                    href="#le-garage"
                    onClick={(e) => handleNav('le-garage', e)}
                    className="inline-block py-1 hover:text-white transition-colors"
                  >
                    Présentation du garage
                  </a>
                </li>
                <li>
                  <a
                    href="#avis"
                    onClick={(e) => handleNav('avis', e)}
                    className="inline-block py-1 hover:text-white transition-colors"
                  >
                    Avis clients certifiés
                  </a>
                </li>
                <li>
                  <a
                    href="#rendez-vous"
                    onClick={(e) => handleNav('rendez-vous', e)}
                    className="inline-block py-1 hover:text-white transition-colors"
                  >
                    Prendre rendez-vous
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => handleNav('contact', e)}
                    className="inline-block py-1 hover:text-white transition-colors"
                  >
                    Horaires & Coordonnées
                  </a>
                </li>
              </ul>
            </div>

            {/* 3. HORAIRES & ATELIER */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs uppercase tracking-wider text-white font-medium block">
                Atelier Furiani
              </span>
              <p className="text-[13px] text-white/60 leading-relaxed font-light">
                Ouvert du lundi au vendredi de 08:30 à 18:30. Fermé les samedis et dimanches.
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${content.phone}`}
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 bg-white/10 active:bg-white/20 text-white text-xs px-4 py-2.5 rounded-full transition-colors font-mono"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Appel direct : {content.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR: MENTIONS, RGPD & TOP */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/40">
            <div>
              <p>© {new Date().getFullYear()} {content.brandName}. Tous droits réservés.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setLegalModalOpen('mentions')}
                className="min-h-[44px] inline-flex items-center hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
              >
                Mentions légales
              </button>
              <button
                type="button"
                onClick={() => setLegalModalOpen('rgpd')}
                className="min-h-[44px] inline-flex items-center hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
              >
                Confidentialité (RGPD)
              </button>
              <button
                type="button"
                onClick={scrollToTop}
                className="min-h-[44px] inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ml-auto sm:ml-0"
              >
                <span>Haut de page</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* LEGAL & RGPD BOTTOM SHEET / MODAL */}
      {legalModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLegalModalOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-2xl max-h-[85dvh] bg-[#0f1117] border border-white/15 rounded-t-[28px] sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-white relative overflow-y-auto animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 safe-area-bottom"
          >
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4 sm:hidden" />

            <button
              type="button"
              onClick={() => setLegalModalOpen(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 flex items-center justify-center text-white cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            {legalModalOpen === 'mentions' ? (
              <div className="space-y-3.5 text-xs sm:text-sm text-white/70">
                <h3 className="text-[20px] font-semibold text-white mb-3">Mentions légales</h3>
                <p>
                  <strong>Éditeur du site :</strong> {content.brandName}
                </p>
                <p>
                  <strong>Adresse :</strong> {content.addressLine1}, {content.addressLine2}, {content.addressLine3}
                </p>
                <p>
                  <strong>Téléphone :</strong> {content.phoneDisplay}
                </p>
                <p>
                  <strong>Activité :</strong> Réparation, entretien et diagnostic mécanique automobile.
                </p>
                <p>
                  <strong>Hébergement :</strong> Cloudflare Workers & Cloudflare Pages.
                </p>
                <p>
                  <strong>Propriété intellectuelle :</strong> L’ensemble des contenus, marques, logos et éléments graphiques sont la propriété exclusive de {content.brandName}.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs sm:text-sm text-white/70">
                <h3 className="text-[20px] font-semibold text-white mb-3">Politique de confidentialité (RGPD)</h3>
                <p>
                  La présente politique décrit la manière dont <strong>{content.brandName}</strong> traite et protège les données transmises par les utilisateurs du site.
                </p>
                <p>
                  <strong>Collecte des données :</strong> Les seules données collectées sont celles transmises volontairement par le biais du formulaire de prise de rendez-vous (nom, numéro de téléphone, immatriculation, modèle et motif d’intervention).
                </p>
                <p>
                  <strong>Finalité du traitement :</strong> Ces informations sont utilisées exclusivement pour vous recontacter, préparer votre devis ou organiser la prise en charge de votre véhicule à l’atelier de Bastia.
                </p>
                <p>
                  <strong>Conservation & Destinataires :</strong> Vos données ne font l’objet d’aucune cession ni vente à des tiers. Elles sont conservées uniquement pendant la durée nécessaire à la gestion de la relation client.
                </p>
                <p>
                  <strong>Vos droits :</strong> Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données personnelles en contactant l’atelier au {content.phoneDisplay}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
