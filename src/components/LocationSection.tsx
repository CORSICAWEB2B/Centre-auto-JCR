import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { EditableText } from './EditableText';
import { ScrollReveal } from './ScrollReveal';

export const LocationSection: React.FC = () => {
  const { content, updateField, updateOpeningHour } = useSiteContent();

  return (
    <section
      id="localisation"
      className="relative z-10 w-full min-h-screen py-24 px-5 sm:px-8 md:px-10 flex flex-col justify-center border-t border-white/10 bg-black/90 backdrop-blur-md"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* LOCATION DETAILS WITH SCROLL REVEAL */}
          <ScrollReveal direction="up" distance={30} duration={800}>
            <div>
              <p className="text-white/50 text-[13px] tracking-widest uppercase mb-3">
                <EditableText
                  as="span"
                  value={content.locationTitle}
                  onChange={(val) => updateField('locationTitle', val)}
                />
              </p>
              <EditableText
                as="h2"
                value={content.brandName}
                onChange={(val) => updateField('brandName', val)}
                className="text-[32px] sm:text-[40px] text-white tracking-tight leading-tight font-normal mb-8 block"
                style={{ fontFamily: 'var(--font-heading)' }}
              />

              <address className="not-italic text-[18px] sm:text-[20px] text-white/90 leading-relaxed font-light space-y-1 mb-8">
                <EditableText
                  as="p"
                  value={content.addressLine1}
                  onChange={(val) => updateField('addressLine1', val)}
                />
                <EditableText
                  as="p"
                  value={content.addressLine2}
                  onChange={(val) => updateField('addressLine2', val)}
                />
                <EditableText
                  as="p"
                  value={content.addressLine3}
                  onChange={(val) => updateField('addressLine3', val)}
                />
              </address>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div>
                  <span className="block text-white/50 text-[12px] tracking-wider uppercase mb-1">
                    Téléphone direct
                  </span>
                  <EditableText
                    as="a"
                    href={`tel:${content.phone}`}
                    value={content.phoneDisplay}
                    onChange={(val) => {
                      updateField('phoneDisplay', val);
                      updateField('phone', val.replace(/\s+/g, ''));
                    }}
                    className="text-[22px] text-white underline underline-offset-4 hover:opacity-60 transition-opacity block"
                  />
                </div>

                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${content.brandName} ${content.addressLine1} ${content.addressLine2} ${content.addressLine3}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[14px] underline underline-offset-4 transition-colors"
                  >
                    <span>Ouvrir dans Google Maps</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* OPENING HOURS WITH STAGGERED SCROLL REVEAL */}
          <ScrollReveal direction="up" distance={30} delay={180} duration={850}>
            <div id="horaires">
              <p className="text-white/50 text-[13px] tracking-widest uppercase mb-3">
                <EditableText
                  as="span"
                  value={content.hoursTitle}
                  onChange={(val) => updateField('hoursTitle', val)}
                />
              </p>
              <h2
                className="text-[32px] sm:text-[40px] text-white tracking-tight leading-tight font-normal mb-8"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Horaires
              </h2>

              <div className="divide-y divide-white/10 border-t border-b border-white/10">
                {content.openingHours.map((item, index) => (
                  <div
                    key={item.day}
                    className="py-3 sm:py-3.5 flex justify-between items-center text-[16px] sm:text-[17px]"
                  >
                    <span className="text-white/80 font-normal">{item.day}</span>
                    <EditableText
                      as="span"
                      value={item.hours}
                      onChange={(val) => updateOpeningHour(index, 'hours', val)}
                      className={`font-mono text-[15px] sm:text-[16px] ${
                        item.open ? 'text-white' : 'text-white/40'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <EditableText
                as="p"
                multiline
                value={content.hoursNote}
                onChange={(val) => updateField('hoursNote', val)}
                className="text-white/40 text-[13px] mt-6 leading-relaxed block"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
