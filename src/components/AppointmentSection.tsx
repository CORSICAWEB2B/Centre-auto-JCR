import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { EditableText } from './EditableText';
import { ScrollReveal } from './ScrollReveal';

export const AppointmentSection: React.FC = () => {
  const { content, updateField } = useSiteContent();
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [plaque, setPlaque] = useState('');
  const [modele, setModele] = useState('');
  const [demande, setDemande] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !telephone || !plaque || !demande || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/send-appointment', {
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
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rendez-vous"
      className="relative z-10 w-full min-h-screen py-24 px-5 sm:px-8 md:px-10 flex flex-col justify-center border-t border-white/10 bg-black/85 backdrop-blur-md"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-2xl mx-auto w-full">
        {/* Minimal header with Scroll Reveal */}
        <ScrollReveal direction="up" distance={30} duration={800} className="mb-12">
          <p className="text-white/50 text-[13px] tracking-widest uppercase mb-3">
            Atelier Bastia — Furiani
          </p>
          <EditableText
            as="h2"
            value={content.appointmentTitle}
            onChange={(val) => updateField('appointmentTitle', val)}
            className="text-[32px] sm:text-[44px] text-white tracking-tight leading-tight font-normal block"
            style={{ fontFamily: 'var(--font-heading)' }}
          />
          <p className="text-white/70 text-[16px] sm:text-[18px] mt-2 font-light">
            <EditableText
              as="span"
              value={content.appointmentSubtitle}
              onChange={(val) => updateField('appointmentSubtitle', val)}
            />{' '}
            <a
              href={`tel:${content.phone}`}
              className="text-white underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              {content.phoneDisplay}
            </a>
            .
          </p>
        </ScrollReveal>

        {submitted ? (
          <ScrollReveal direction="up" distance={24} duration={600}>
            <div className="border border-white/20 p-8 rounded-sm bg-white/5 text-white">
              <h3 className="text-[20px] font-medium mb-3">Demande enregistrée</h3>
              <p className="text-white/80 text-[15px] leading-relaxed mb-6">
                Votre demande a bien été préparée pour l’équipe de {content.brandName}.
                Pour une prise en charge immédiate ou une urgence mécanique à Bastia, joignez directement l’atelier :
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href={`tel:${content.phone}`}
                  className="inline-flex items-center justify-center bg-white text-black px-6 py-2.5 rounded-full text-[14px] hover:bg-neutral-200 transition-colors"
                >
                  Appeler l’atelier : {content.phoneDisplay}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setDemande('');
                  }}
                  className="text-white/60 hover:text-white text-[14px] underline underline-offset-4 cursor-pointer"
                >
                  Nouvelle demande
                </button>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal direction="up" distance={28} delay={150} duration={850}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-white/70 text-[13px] tracking-wide uppercase mb-2">
                    Nom
                  </label>
                  <input
                    id="nom"
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 focus:border-white text-white py-2 text-[16px] outline-none transition-colors placeholder:text-white/25"
                    placeholder="Votre nom complet"
                  />
                </div>

                {/* Numéro de téléphone */}
                <div>
                  <label htmlFor="telephone" className="block text-white/70 text-[13px] tracking-wide uppercase mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    id="telephone"
                    type="tel"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 focus:border-white text-white py-2 text-[16px] outline-none transition-colors placeholder:text-white/25"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Plaque d'immatriculation */}
                <div>
                  <label htmlFor="plaque" className="block text-white/70 text-[13px] tracking-wide uppercase mb-2">
                    Plaque d’immatriculation
                  </label>
                  <input
                    id="plaque"
                    type="text"
                    required
                    value={plaque}
                    onChange={(e) => setPlaque(e.target.value.toUpperCase())}
                    className="w-full bg-transparent border-b border-white/30 focus:border-white text-white py-2 text-[16px] uppercase tracking-wider outline-none transition-colors placeholder:text-white/25"
                    placeholder="AA-123-BB"
                  />
                </div>

                {/* Modèle du véhicule (optional) */}
                <div>
                  <label htmlFor="modele" className="block text-white/70 text-[13px] tracking-wide uppercase mb-2">
                    Modèle du véhicule <span className="text-white/40 text-[11px] normal-case">(optionnel)</span>
                  </label>
                  <input
                    id="modele"
                    type="text"
                    value={modele}
                    onChange={(e) => setModele(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 focus:border-white text-white py-2 text-[16px] outline-none transition-colors placeholder:text-white/25"
                    placeholder="Ex : Renault Clio V, Peugeot 3008..."
                  />
                </div>
              </div>

              {/* Raison de la panne ou de la demande */}
              <div>
                <label htmlFor="demande" className="block text-white/70 text-[13px] tracking-wide uppercase mb-2">
                  Raison de la panne ou de la demande
                </label>
                <textarea
                  id="demande"
                  required
                  rows={4}
                  value={demande}
                  onChange={(e) => setDemande(e.target.value)}
                  placeholder="Décrivez le bruit, le voyant, la panne ou l’entretien souhaité…"
                  className="w-full bg-transparent border-b border-white/30 focus:border-white text-white py-2 text-[16px] outline-none transition-colors placeholder:text-white/25 resize-none leading-relaxed"
                />
              </div>

              {/* Submit button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[15px] px-8 py-3 hover:bg-neutral-200 transition-colors duration-200 cursor-pointer self-start focus:outline-none disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmission en cours…' : 'Envoyer ma demande'}
                </button>

                <p className="text-white/40 text-[12px]">
                  Réponse rapide pendant nos horaires d’ouverture.
                </p>
              </div>
            </form>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
