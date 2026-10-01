import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Phone, Play, Pause, ShieldCheck, MapPin } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroProps {
  onSelectAction: (target: 'rendez-vous' | 'services' | 'localisation' | 'horaires' | 'avis') => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectAction }) => {
  const { content } = useSiteContent();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleVideoPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative z-10 pt-[78px] pb-10 sm:pt-32 sm:pb-16 md:pt-36 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* MOBILE & DESKTOP EDITORIAL TEXT BLOCK */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* 1. Kicker / Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-white/65 mb-3 sm:mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-medium tracking-wide">Centre Auto JCR · Bastia</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-white/50">Atelier mécanique</span>
          </div>

          {/* 2. Main Title (Responsive clamp: 30-36px mobile, 44-58px desktop) */}
          <h1
            className="text-[30px] sm:text-[42px] md:text-[50px] lg:text-[58px] font-semibold tracking-[-0.03em] text-white leading-[1.14] sm:leading-[1.08] mb-4 sm:mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Entretien, diagnostic et réparation automobile
          </h1>

          {/* 3. Short Subtitle */}
          <p className="text-[15px] sm:text-[17px] md:text-[19px] text-white/70 leading-relaxed font-light mb-6 sm:mb-8 max-w-2xl">
            Un entretien à prévoir, un voyant allumé ou un bruit inhabituel ? Notre équipe vous accompagne à Bastia pour diagnostiquer et entretenir votre véhicule en toute transparence.
          </p>

          {/* 4. Two Actions Maximum (Full-width on mobile, side-by-side on sm+) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-0">
            <button
              type="button"
              onClick={() => onSelectAction('rendez-vous')}
              className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2.5 bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 font-semibold text-[15px] sm:text-[16px] px-6 sm:px-7 py-3 rounded-full transition-all duration-200 shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Prendre rendez-vous</span>
            </button>

            <a
              href={`tel:${content.phone}`}
              className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2.5 bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.2] border border-white/15 hover:border-white/30 text-white font-medium text-[15px] sm:text-[16px] px-6 py-3 rounded-full transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Appeler le garage</span>
            </a>
          </div>

          {/* 5. Micro reassurance tags on desktop */}
          <div className="hidden sm:flex mt-8 pt-6 border-t border-white/[0.08] items-center gap-6 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-white/70" />
              Toutes marques prises en charge
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-white/70" />
              Furiani — Bastia
            </span>
          </div>
        </div>

        {/* 6. MEDIA CARD (Displayed BELOW text & actions on mobile, beside on desktop) */}
        <div className="lg:col-span-5 mt-2 sm:mt-4 lg:mt-0">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0d0f14] shadow-xl sm:shadow-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] group">
            {/* Embedded video */}
            <video
              ref={videoRef}
              src="/hero-video.mp4"
              className="w-full h-full object-cover"
              muted
              playsInline
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Top Bar inside media card */}
            <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] sm:text-xs">Atelier mécanique</span>
              </div>

              {/* Play / Pause toggle */}
              <button
                type="button"
                onClick={toggleVideoPlay}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 active:bg-black backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                aria-label={isPlaying ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>
            </div>

            {/* Bottom caption inside media card */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-black/65 backdrop-blur-md border border-white/10 text-white/90 flex items-center justify-between">
              <div>
                <p className="text-[12.5px] sm:text-[13px] font-medium text-white leading-tight">Centre Auto JCR</p>
                <p className="text-[10.5px] sm:text-[11px] text-white/50">Furiani · 20600 Bastia</p>
              </div>
              <span className="text-[11px] font-mono text-amber-300">★ 4,8 / 5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
