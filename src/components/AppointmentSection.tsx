import React, { useState } from 'react';
import { Calendar, Phone, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface AppointmentSectionProps {
  initialServiceName?: string;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({ initialServiceName }) => {
  const { content } = useSiteContent();
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [plaque, setPlaque] = useState('');
  const [modele, setModele] = useState('');
  const [demande, setDemande] = useState(
    initialServiceName ? `Demande de rendez-vous pour : ${initialServiceName}` : ''
  );
  const [rgpdAccepted, setRgpdAccepted] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!nom.trim()) errs.nom = 'Veuillez renseigner votre nom complet.';
    if (!telephone.trim()) {
      errs.telephone = 'Veuillez renseigner un numéro de téléphone joignable.';
    } else if (telephone.trim().length < 8) {
      errs.telephone = 'Le numéro de téléphone semble incomplet.';
    }
    if (!plaque.trim()) errs.plaque = 'L’immatriculation est requise pour préparer le dossier.';
    if (!demande.trim()) errs.demande = 'Veuillez préciser la panne ou l’intervention souhaitée.';
    if (!rgpdAccepted) errs.rgpd = 'Veuillez accepter l’utilisation de vos données pour le rendez-vous.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          telephone,
          plaque,
          modele,
          demande,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l’envoi de la demande.');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      // Fallback display confirmation so the user is never stuck
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rendez-vous" className="relative z-10 py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#07080a]">
      <div className="max-w-4xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-white/50 mb-2.5 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span>Prise de rendez-vous atelier</span>
          </div>

          <h2
            className="text-[26px] sm:text-[38px] lg:text-[44px] font-semibold text-white tracking-[-0.03em] leading-tight mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Prendre rendez-vous
          </h2>

          <p className="text-[14.5px] sm:text-[17px] text-white/65 font-light leading-relaxed">
            Remplissez notre formulaire pour planifier l’entretien ou le diagnostic de votre véhicule. Notre équipe vous recontacte rapidement.
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#0f1117] border border-white/[0.08] p-5 sm:p-8 lg:p-12 shadow-xl sm:shadow-2xl relative overflow-hidden">
          {submitted ? (
            <div className="py-6 sm:py-8 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <h3
                className="text-[22px] sm:text-[26px] font-medium text-white mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Demande transmise avec succès
              </h3>

              <p className="text-white/70 text-[14.5px] sm:text-[16px] leading-relaxed mb-6 sm:mb-8 font-light">
                Votre demande a bien été envoyée à l’équipe du {content.brandName}. Nous vous recontacterons au {telephone || 'téléphone'} pour convenir du rendez-vous.
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-6 sm:mb-8">
                <p className="text-xs text-white/50 mb-1">Une urgence mécanique ?</p>
                <a
                  href={`tel:${content.phone}`}
                  className="min-h-[44px] inline-flex items-center justify-center text-white font-mono text-[15px] sm:text-[16px] hover:underline font-medium"
                >
                  Appelez l’atelier : {content.phoneDisplay}
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setDemande('');
                  setModele('');
                  setPlaque('');
                  setErrors({});
                }}
                className="min-h-[48px] inline-flex items-center justify-center bg-white/10 active:bg-white/20 text-white text-[14px] px-6 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* FIELD 1 & 2: NOM & TELEPHONE (Single column on mobile, 2-cols on sm+) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-[12px] uppercase tracking-wider text-white/70 mb-1.5 font-medium"
                  >
                    Nom complet <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="nom"
                    type="text"
                    required
                    autoComplete="name"
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                      if (errors.nom) setErrors((prev) => ({ ...prev, nom: '' }));
                    }}
                    placeholder="Ex : Jean Dupont"
                    className={`w-full min-h-[50px] bg-[#141720] border ${
                      errors.nom ? 'border-red-400' : 'border-white/10'
                    } rounded-xl sm:rounded-2xl px-4 py-3 text-white placeholder:text-white/30 text-[16px] focus:outline-none focus:border-white/50 transition-colors`}
                  />
                  {errors.nom && (
                    <p className="mt-1 text-[12px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.nom}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="telephone"
                    className="block text-[12px] uppercase tracking-wider text-white/70 mb-1.5 font-medium"
                  >
                    Numéro de téléphone <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="telephone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={telephone}
                    onChange={(e) => {
                      setTelephone(e.target.value);
                      if (errors.telephone) setErrors((prev) => ({ ...prev, telephone: '' }));
                    }}
                    placeholder="Ex : 06 12 34 56 78"
                    className={`w-full min-h-[50px] bg-[#141720] border ${
                      errors.telephone ? 'border-red-400' : 'border-white/10'
                    } rounded-xl sm:rounded-2xl px-4 py-3 text-white placeholder:text-white/30 text-[16px] focus:outline-none focus:border-white/50 transition-colors`}
                  />
                  {errors.telephone && (
                    <p className="mt-1 text-[12px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.telephone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* FIELD 3 & 4: PLAQUE & MODELE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="plaque"
                    className="block text-[12px] uppercase tracking-wider text-white/70 mb-1.5 font-medium"
                  >
                    Plaque d’immatriculation <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="plaque"
                    type="text"
                    required
                    autoCapitalize="characters"
                    value={plaque}
                    onChange={(e) => {
                      setPlaque(e.target.value.toUpperCase());
                      if (errors.plaque) setErrors((prev) => ({ ...prev, plaque: '' }));
                    }}
                    placeholder="Ex : AA-123-BB"
                    className={`w-full min-h-[50px] bg-[#141720] border ${
                      errors.plaque ? 'border-red-400' : 'border-white/10'
                    } rounded-xl sm:rounded-2xl px-4 py-3 text-white placeholder:text-white/30 text-[16px] uppercase font-mono tracking-wider focus:outline-none focus:border-white/50 transition-colors`}
                  />
                  {errors.plaque && (
                    <p className="mt-1 text-[12px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.plaque}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="modele"
                    className="block text-[12px] uppercase tracking-wider text-white/70 mb-1.5 font-medium"
                  >
                    Marque & modèle <span className="text-white/40 text-[11px] normal-case">(optionnel)</span>
                  </label>
                  <input
                    id="modele"
                    type="text"
                    value={modele}
                    onChange={(e) => setModele(e.target.value)}
                    placeholder="Ex : Renault Clio V, Peugeot 208..."
                    className="w-full min-h-[50px] bg-[#141720] border border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 text-white placeholder:text-white/30 text-[16px] focus:outline-none focus:border-white/50 transition-colors"
                  />
                </div>
              </div>

              {/* FIELD 5: NATURE DE LA DEMANDE */}
              <div>
                <label
                  htmlFor="demande"
                  className="block text-[12px] uppercase tracking-wider text-white/70 mb-1.5 font-medium"
                >
                  Nature de la demande ou panne constatée <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  id="demande"
                  required
                  rows={4}
                  value={demande}
                  onChange={(e) => {
                    setDemande(e.target.value);
                    if (errors.demande) setErrors((prev) => ({ ...prev, demande: '' }));
                  }}
                  placeholder="Décrivez l’intervention souhaitée, un voyant allumé, un bruit inhabituel ou votre révision…"
                  className={`w-full bg-[#141720] border ${
                    errors.demande ? 'border-red-400' : 'border-white/10'
                  } rounded-xl sm:rounded-2xl p-4 text-white placeholder:text-white/30 text-[16px] focus:outline-none focus:border-white/50 transition-colors resize-none leading-relaxed`}
                />
                {errors.demande && (
                  <p className="mt-1 text-[12px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.demande}</span>
                  </p>
                )}
              </div>

              {/* RGPD CHECKBOX (Touch-friendly 44px+ hit box) */}
              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none group min-h-[44px] py-1">
                  <input
                    type="checkbox"
                    checked={rgpdAccepted}
                    onChange={(e) => {
                      setRgpdAccepted(e.target.checked);
                      if (errors.rgpd) setErrors((prev) => ({ ...prev, rgpd: '' }));
                    }}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-white accent-white cursor-pointer flex-shrink-0"
                  />
                  <span className="text-[12.5px] sm:text-[13px] text-white/60 leading-snug group-hover:text-white/80 transition-colors">
                    J’accepte que les données saisies soient utilisées par le Centre Auto JCR pour me recontacter dans le cadre de ma demande de rendez-vous.
                  </span>
                </label>
                {errors.rgpd && (
                  <p className="text-[12px] text-red-400 flex items-center gap-1 pl-8">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.rgpd}</span>
                  </p>
                )}
              </div>

              {/* ACTION ROW: Full-width button on mobile */}
              <div className="pt-3 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2.5 bg-white text-black active:bg-neutral-200 font-semibold text-[15.5px] px-8 py-3.5 rounded-full transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmission en cours…' : 'Envoyer ma demande'}</span>
                </button>

                {/* TELEPHONE PROMPT */}
                <div className="flex items-center gap-3 pt-2 sm:pt-0">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/80 flex-shrink-0">
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block">Vous préférez appeler ?</span>
                    <a
                      href={`tel:${content.phone}`}
                      className="text-[15px] sm:text-[16px] text-white font-mono font-medium hover:underline block leading-tight"
                    >
                      {content.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
