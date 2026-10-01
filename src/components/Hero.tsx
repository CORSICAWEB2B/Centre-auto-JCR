import React, { useState, useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import { useSiteContent } from '../context/SiteContentContext';
import { EditableText } from './EditableText';

interface HeroProps {
  onSelectAction: (target: 'rendez-vous' | 'services' | 'localisation' | 'horaires' | 'avis') => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectAction }) => {
  const { content, updateField, isEditing } = useSiteContent();
  const { displayed, done } = useTypewriter(content.typewriterText, 38, 600);
  const [buttonsVisible, setButtonsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Buttons become visible 400ms after page load.
    const timer = setTimeout(() => {
      setButtonsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative z-[1] w-full h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-xl relative z-10">
        {/* 
          GOOGLE REVIEWS BADGE / BUTTON (Displayed above intro lines on smartphone, preserved on PC in navbar)
        */}
        <div className="md:hidden mb-3.5 sm:mb-4">
          <a
            href="#avis"
            onClick={(e) => {
              e.preventDefault();
              onSelectAction('avis');
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 active:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-[13px] text-white tracking-normal shadow-sm cursor-pointer"
            title="Consulter nos avis clients sur Google"
          >
            <span className="text-amber-400 select-none text-[12px] leading-none" aria-label="5 étoiles">
              ⭐⭐⭐⭐⭐
            </span>
            <span className="font-semibold text-white tracking-tight text-[13px]">4,8/5</span>
            <span className="text-white/75 text-[12px]">sur Google</span>
          </a>
        </div>

        {/* 
          1. INTRO LABEL (Unblurred & Editable)
        */}
        <div
          className="mb-5 sm:mb-6 text-white font-normal"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
          }}
        >
          <EditableText
            as="span"
            value={content.introLine1}
            onChange={(val) => updateField('introLine1', val)}
            className="block"
          />
          <EditableText
            as="span"
            value={content.introLine2}
            onChange={(val) => updateField('introLine2', val)}
            className="block"
          />
        </div>

        {/* 
          2. TYPEWRITER TEXT
          In normal mode: animated typewriter with blinking cursor.
          In edit mode: full text editable in-place!
        */}
        {isEditing ? (
          <div className="mb-5 sm:mb-6">
            <span className="block text-[11px] text-amber-300 uppercase tracking-wider mb-1">
              ✏️ Texte machine à écrire (cliquez pour modifier) :
            </span>
            <EditableText
              as="p"
              multiline
              value={content.typewriterText}
              onChange={(val) => updateField('typewriterText', val)}
              className="text-white font-normal min-h-[54px]"
              style={{
                fontSize: 'clamp(18px, 4vw, 26px)',
                lineHeight: 1.35,
              }}
            />
          </div>
        ) : (
          <p
            className="text-white mb-5 sm:mb-6 font-normal min-h-[54px]"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
            }}
          >
            <span>{displayed}</span>
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink"
                aria-hidden="true"
              />
            )}
          </p>
        )}

        {/* 
          3. ACTION PILL BUTTONS
          Visible 400ms after page load.
        */}
        <div
          className={`flex flex-wrap gap-y-1 transition-all duration-400 ease-out ${
            buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* WHITE PILL BUTTON 1 */}
          <button
            type="button"
            onClick={() => onSelectAction('rendez-vous')}
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            <EditableText
              as="span"
              value={content.pillAppointment}
              onChange={(val) => updateField('pillAppointment', val)}
            />
          </button>

          {/* WHITE PILL BUTTON 2 */}
          <button
            type="button"
            onClick={() => onSelectAction('services')}
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            <EditableText
              as="span"
              value={content.pillServices}
              onChange={(val) => updateField('pillServices', val)}
            />
          </button>

          {/* WHITE PILL BUTTON 3 */}
          <button
            type="button"
            onClick={() => onSelectAction('localisation')}
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            <EditableText
              as="span"
              value={content.pillLocation}
              onChange={(val) => updateField('pillLocation', val)}
            />
          </button>

          {/* WHITE PILL BUTTON 4 */}
          <button
            type="button"
            onClick={() => onSelectAction('horaires')}
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            <EditableText
              as="span"
              value={content.pillHours}
              onChange={(val) => updateField('pillHours', val)}
            />
          </button>

          {/* OUTLINE PILL BUTTON: Phone call CTA */}
          <button
            type="button"
            onClick={() => {
              if (!isEditing) {
                window.location.href = `tel:${content.phone}`;
              }
            }}
            className="text-white bg-transparent border border-white rounded-full inline-flex items-center justify-center text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            <span>
              <EditableText
                as="span"
                value={content.pillCallPrefix}
                onChange={(val) => updateField('pillCallPrefix', val)}
              />{' '}
              <EditableText
                as="span"
                value={content.phoneDisplay}
                onChange={(val) => {
                  updateField('phoneDisplay', val);
                  updateField('phone', val.replace(/\s+/g, ''));
                }}
              />
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
