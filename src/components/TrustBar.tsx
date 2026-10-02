import React from 'react';
import { Star, Wrench, Cpu } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface TrustBarProps {
  onNavigateAvis?: () => void;
}

export const TrustBar: React.FC<TrustBarProps> = ({ onNavigateAvis }) => {
  const { content } = useSiteContent();

  return (
    <div className="relative z-10 w-full border-y border-white/[0.08] bg-[#0b0c10]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8 items-center md:divide-x md:divide-white/[0.08]">
          {/* ITEM 1: GOOGLE RATING (Verified) */}
          <div
            onClick={onNavigateAvis}
            className="flex items-center gap-3 md:pr-4 cursor-pointer group active:opacity-75 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-semibold text-[14.5px] sm:text-[16px] tracking-tight">
                  4,8 / 5 sur Google
                </span>
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
              <p className="text-[12px] sm:text-[12.5px] text-white/50 group-hover:text-white/70 transition-colors truncate">
                Avis clients vérifiés
              </p>
            </div>
          </div>

          {/* ITEM 2: ENTRETIEN & RÉPARATION */}
          <div className="flex items-center gap-3 md:px-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0">
              <Wrench className="w-5 h-5 text-white/90" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-[14.5px] sm:text-[16px] tracking-tight">
                Entretien & réparation
              </p>
              <p className="text-[12px] sm:text-[12.5px] text-white/50 truncate">
                Interventions mécaniques toutes marques
              </p>
            </div>
          </div>

          {/* ITEM 3: DIAGNOSTIC AUTOMOBILE */}
          <div className="flex items-center gap-3 md:pl-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0">
              <Cpu className="w-5 h-5 text-white/90" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-[14.5px] sm:text-[16px] tracking-tight">
                Diagnostic automobile
              </p>
              <p className="text-[12px] sm:text-[12.5px] text-white/50 truncate">
                Recherche de pannes & voyants moteur
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
