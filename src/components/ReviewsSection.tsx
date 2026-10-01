import React from 'react';
import { Star, ExternalLink, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ReviewsSectionProps {
  onNavigateAppointment?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onNavigateAppointment }) => {
  const { content } = useSiteContent();

  const displayReviews = (content.reviews || []).slice(0, 3);

  const googleMapsReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${content.brandName} Furiani Bastia avis`
  )}`;

  return (
    <section id="avis" className="relative z-10 py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#090a0e]">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-white/50 mb-2 sm:mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Avis Google certifiés</span>
            </div>
            <h2
              className="text-[26px] sm:text-[38px] lg:text-[46px] font-semibold text-white tracking-[-0.03em] leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ce que disent nos clients
            </h2>
          </div>

          {/* GOOGLE RATING HIGHLIGHT + LINK (Touch-friendly on mobile) */}
          <div className="flex items-center justify-between sm:justify-start gap-4 bg-[#0f1117] border border-white/[0.08] px-4 sm:px-5 py-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-semibold text-white text-[15px] sm:text-[16px]">4,8</span>
              <span className="text-white/40 text-xs">/ 5</span>
            </div>
            <span className="text-white/20">|</span>
            <a
              href={googleMapsReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-[13px] text-white/85 hover:text-white transition-colors"
            >
              <span>Voir sur Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/50" />
            </a>
          </div>
        </div>

        {/* REVIEWS CONTAINER: Smooth swipe scroll-snap carousel on mobile, 3-column grid on desktop */}
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 pb-2 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {displayReviews.map((review, index) => (
            <div
              key={review.id || index}
              className="w-[85vw] max-w-[340px] flex-shrink-0 snap-center md:w-auto md:max-w-none rounded-2xl sm:rounded-3xl bg-[#0f1117] border border-white/[0.08] p-5 sm:p-7 lg:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-200 shadow-lg"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 text-sm mb-4 select-none">
                  {'★'.repeat(review.rating || 5)}
                </div>

                {/* Review Quote */}
                <p className="text-[14px] sm:text-[15.5px] text-white/80 font-light leading-relaxed mb-6">
                  « {review.text} »
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-semibold select-none">
                    {review.author ? review.author.charAt(0) : 'C'}
                  </div>
                  <div>
                    <p className="text-[13px] sm:text-[14px] font-medium text-white leading-tight">
                      {review.author}
                    </p>
                    <span className="text-[11px] text-white/40">Client vérifié</span>
                  </div>
                </div>

                <span className="text-[10.5px] sm:text-[11px] text-emerald-400/90 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  {review.badge || 'Vérifié'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE HORIZONTAL CAROUSEL SWIPE HINT */}
        <div className="md:hidden mt-3 flex justify-center items-center gap-1 text-[11px] text-white/40">
          <span>Glissez horizontalement pour lire les avis</span>
          <span>→</span>
        </div>

        {/* BOTTOM REASSURANCE & CTA */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[12.5px] sm:text-sm text-white/50">
            La satisfaction de nos clients et la clarté de nos diagnostics sont notre priorité quotidienne.
          </p>

          <a
            href={googleMapsReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center gap-2 text-[13px] sm:text-sm text-white hover:underline underline-offset-4"
          >
            <span>Consulter tous les avis sur Google Maps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
