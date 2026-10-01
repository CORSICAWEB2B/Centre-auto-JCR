import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { EditableText } from './EditableText';
import { ScrollReveal } from './ScrollReveal';

export const ReviewsSection: React.FC = () => {
  const { content, updateField, updateReview } = useSiteContent();

  const reviewsList = content.reviews || [];

  return (
    <section
      id="avis"
      className="relative z-10 w-full py-24 px-5 sm:px-8 md:px-10 flex flex-col justify-center border-t border-white/10 bg-black/90 backdrop-blur-md"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Anchor for nos-avis */}
      <span id="nos-avis" className="sr-only" aria-hidden="true" />

      <div className="max-w-5xl mx-auto w-full">
        {/* Header with Google Rating Badge */}
        <ScrollReveal direction="up" distance={30} duration={800} className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <p className="text-white/50 text-[13px] tracking-widest uppercase mb-3">
                Avis & Témoignages
              </p>
              <EditableText
                as="h2"
                value={content.reviewsTitle}
                onChange={(val) => updateField('reviewsTitle', val)}
                className="text-[32px] sm:text-[44px] text-white tracking-tight leading-tight font-normal block"
                style={{ fontFamily: 'var(--font-heading)' }}
              />
              <EditableText
                as="p"
                multiline
                value={content.reviewsSubtitle}
                onChange={(val) => updateField('reviewsSubtitle', val)}
                className="text-white/70 text-[16px] sm:text-[18px] mt-2 font-light max-w-xl block"
              />
            </div>

            {/* Google Rating Showcase Box */}
            <div className="flex flex-col sm:items-end bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm self-start md:self-auto">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-amber-400 text-lg sm:text-xl tracking-tight select-none">
                  ★★★★★
                </span>
                <span className="text-white font-medium text-[19px] sm:text-[21px] tracking-tight">
                  4,8/5
                </span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-white/60">
                <svg
                  className="w-4 h-4 text-white/80"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z" />
                </svg>
                <span>Avis certifiés sur Google</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${content.brandName} Furiani Bastia avis`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-[12px] text-white/50 hover:text-white underline underline-offset-4 transition-colors"
              >
                Consulter sur Google Maps ↗
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Reviews Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {reviewsList.map((review, index) => (
            <ScrollReveal
              key={review.id}
              direction="up"
              distance={20}
              delay={index * 60}
              duration={650}
            >
              <div className="h-full bg-white/[0.02] hover:bg-white/[0.04] active:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-xl p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 group shadow-sm">
                <div>
                  {/* Top Bar: Stars + Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-amber-400 text-sm tracking-widest select-none">
                      {'★'.repeat(review.rating || 5)}
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400/90 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                      {review.badge || 'Avis vérifié'}
                    </span>
                  </div>

                  {/* Review Text */}
                  <EditableText
                    as="p"
                    multiline
                    value={review.text}
                    onChange={(val) => updateReview(index, 'text', val)}
                    className="text-white/80 text-[15px] sm:text-[16px] leading-relaxed font-light italic mb-6 block"
                  />
                </div>

                {/* Author footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[12px] text-white font-medium select-none">
                      {review.author ? review.author.charAt(0) : 'C'}
                    </div>
                    <div>
                      <EditableText
                        as="span"
                        value={review.author}
                        onChange={(val) => updateReview(index, 'author', val)}
                        className="text-white text-[14px] font-medium block"
                      />
                      <span className="text-[12px] text-white/40 block">Client Google Maps</span>
                    </div>
                  </div>

                  <span className="text-[12px] text-white/40 font-mono">Google ★ 5.0</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Section bottom CTA */}
        <ScrollReveal
          direction="up"
          distance={20}
          delay={300}
          duration={700}
          className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-white/10"
        >
          <div className="text-white/60 text-[14px]">
            Vous êtes client chez {content.brandName} ? Votre avis compte énormément pour notre équipe.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#rendez-vous"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[14px] px-6 py-2.5 hover:bg-neutral-200 transition-colors"
            >
              Prendre rendez-vous à l’atelier
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
