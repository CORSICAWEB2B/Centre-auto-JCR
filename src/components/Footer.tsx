import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';

export const Footer: React.FC = () => {
  const { content } = useSiteContent();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative z-10 w-full py-12 px-5 sm:px-8 md:px-10 border-t border-white/10 bg-black/95 text-white/60 text-[14px]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-white">
          <span
            className="text-[18px] tracking-tight font-normal"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {content.brandName}
          </span>
          <span className="text-[20px] select-none" aria-hidden="true">
            ✳︎
          </span>
          <span className="text-white/40 text-[13px] ml-2">Bastia, Corse</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[13px]">
          <a
            href={`tel:${content.phone}`}
            className="text-white/80 hover:text-white underline underline-offset-4 transition-colors"
          >
            {content.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            Haut de page ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
