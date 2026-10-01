import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { EditableText } from './EditableText';
import { ScrollReveal } from './ScrollReveal';

export const ServicesSection: React.FC = () => {
  const { content, updateField, updateService } = useSiteContent();

  return (
    <section
      id="services"
      className="relative z-10 w-full min-h-screen py-24 px-5 sm:px-8 md:px-10 flex flex-col justify-center border-t border-white/10 bg-black/85 backdrop-blur-md"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal direction="up" distance={30} duration={800} className="mb-16">
          <p className="text-white/50 text-[13px] tracking-widest uppercase mb-3">
            Compétences & Atelier
          </p>
          <EditableText
            as="h2"
            value={content.servicesTitle}
            onChange={(val) => updateField('servicesTitle', val)}
            className="text-[32px] sm:text-[44px] text-white tracking-tight leading-tight font-normal block"
            style={{ fontFamily: 'var(--font-heading)' }}
          />
          <EditableText
            as="p"
            multiline
            value={content.servicesSubtitle}
            onChange={(val) => updateField('servicesSubtitle', val)}
            className="text-white/70 text-[16px] sm:text-[18px] mt-2 font-light max-w-xl block"
          />
        </ScrollReveal>

        {/* Minimalist Editorial List with Staggered Scroll Reveal */}
        <div className="divide-y divide-white/10 border-t border-b border-white/10">
          {content.services.map((service, index) => (
            <ScrollReveal
              key={service.id}
              direction="up"
              distance={20}
              delay={index * 50}
              duration={650}
            >
              <div
                id={service.id}
                className="py-5 sm:py-8 group flex flex-col md:flex-row md:items-baseline justify-between gap-2.5 md:gap-8 transition-colors hover:bg-white/[0.03] active:bg-white/[0.04] px-3 -mx-3 rounded-lg"
              >
                <div className="flex items-baseline gap-4 md:w-1/2">
                  <span className="text-[13px] text-white/40 font-mono tracking-wider select-none">
                    {service.num}
                  </span>
                  <EditableText
                    as="h3"
                    value={service.name}
                    onChange={(val) => updateService(index, 'name', val)}
                    className="text-[20px] sm:text-[24px] text-white font-normal tracking-tight group-hover:text-white transition-colors"
                  />
                </div>

                <div className="md:w-1/2">
                  <EditableText
                    as="p"
                    multiline
                    value={service.description}
                    onChange={(val) => updateService(index, 'description', val)}
                    className="text-[15px] sm:text-[16px] text-white/60 font-light leading-relaxed block"
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA to appointment with Scroll Reveal */}
        <ScrollReveal
          direction="up"
          distance={20}
          delay={250}
          duration={800}
          className="mt-12 flex items-center justify-between"
        >
          <a
            href="#rendez-vous"
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[14px] sm:text-[15px] px-6 py-2.5 hover:bg-neutral-200 transition-colors"
          >
            Demander un devis ou un rendez-vous
          </a>

          <a
            href={`tel:${content.phone}`}
            className="text-white/70 hover:text-white text-[14px] sm:text-[15px] underline underline-offset-4 hidden sm:inline-block"
          >
            {content.phoneDisplay}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};
