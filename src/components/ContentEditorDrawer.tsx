import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';

interface ContentEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentEditorDrawer: React.FC<ContentEditorDrawerProps> = ({ isOpen, onClose }) => {
  const { content, updateField, updateService, updateOpeningHour, resetContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'hero' | 'contact' | 'services' | 'horaires'>('hero');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-[#101216] border-l border-white/20 w-full max-w-xl h-full flex flex-col shadow-2xl text-white">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-medium tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Édition des textes du site
            </h2>
            <p className="text-white/50 text-[13px] mt-0.5">
              Modifiez n’importe quel texte ci-dessous avec mise à jour immédiate.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white text-[24px] p-1 leading-none"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 gap-6 text-[14px]">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'hero' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            En-tête & Hero
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'contact' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Coordonnées
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'services' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('horaires')}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'horaires' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Horaires
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'hero' && (
            <>
              <div>
                <label className="block text-[12px] uppercase tracking-wider text-white/50 mb-1">
                  Nom de l’atelier / Marque
                </label>
                <input
                  type="text"
                  value={content.brandName}
                  onChange={(e) => updateField('brandName', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-white/50 mb-1">
                  Ligne d’introduction 1
                </label>
                <input
                  type="text"
                  value={content.introLine1}
                  onChange={(e) => updateField('introLine1', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-white/50 mb-1">
                  Ligne d’introduction 2
                </label>
                <input
                  type="text"
                  value={content.introLine2}
                  onChange={(e) => updateField('introLine2', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-white/50 mb-1">
                  Texte avec effet machine à écrire
                </label>
                <textarea
                  rows={3}
                  value={content.typewriterText}
                  onChange={(e) => updateField('typewriterText', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white resize-none"
                />
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-[13px] text-white/80 font-medium mb-3">Labels des boutons d’action (Pills)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/50 mb-1">Bouton 1</label>
                    <input
                      type="text"
                      value={content.pillAppointment}
                      onChange={(e) => updateField('pillAppointment', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded px-2.5 py-1.5 text-[13px] text-white outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/50 mb-1">Bouton 2</label>
                    <input
                      type="text"
                      value={content.pillServices}
                      onChange={(e) => updateField('pillServices', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded px-2.5 py-1.5 text-[13px] text-white outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/50 mb-1">Bouton 3</label>
                    <input
                      type="text"
                      value={content.pillLocation}
                      onChange={(e) => updateField('pillLocation', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded px-2.5 py-1.5 text-[13px] text-white outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/50 mb-1">Bouton 4</label>
                    <input
                      type="text"
                      value={content.pillHours}
                      onChange={(e) => updateField('pillHours', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded px-2.5 py-1.5 text-[13px] text-white outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'contact' && (
            <>
              <div>
                <label className="block text-[12px] uppercase tracking-wider text-white/50 mb-1">
                  Téléphone (affichage)
                </label>
                <input
                  type="text"
                  value={content.phoneDisplay}
                  onChange={(e) => updateField('phoneDisplay', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-white/50 mb-1">
                  Téléphone (numérotation tel:)
                </label>
                <input
                  type="text"
                  value={content.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                />
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <p className="text-[13px] text-white/80 font-medium">Adresse</p>
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">Ligne 1</label>
                  <input
                    type="text"
                    value={content.addressLine1}
                    onChange={(e) => updateField('addressLine1', e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">Ligne 2</label>
                  <input
                    type="text"
                    value={content.addressLine2}
                    onChange={(e) => updateField('addressLine2', e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">Code Postal & Ville</label>
                  <input
                    type="text"
                    value={content.addressLine3}
                    onChange={(e) => updateField('addressLine3', e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] uppercase tracking-wider text-white/50 mb-1">
                  Titre de section
                </label>
                <input
                  type="text"
                  value={content.servicesTitle}
                  onChange={(e) => updateField('servicesTitle', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white"
                />
              </div>

              <div className="divide-y divide-white/10 pt-2">
                {content.services.map((srv, idx) => (
                  <div key={srv.id} className="py-3 space-y-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-[12px] text-white/40 font-mono">{srv.num}</span>
                      <input
                        type="text"
                        value={srv.name}
                        onChange={(e) => updateService(idx, 'name', e.target.value)}
                        className="flex-1 bg-black/50 border border-white/20 rounded px-2.5 py-1 text-[13px] text-white outline-none focus:border-white font-medium"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => updateService(idx, 'description', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded px-2.5 py-1 text-[12px] text-white/80 outline-none focus:border-white resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'horaires' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] uppercase tracking-wider text-white/50 mb-1">
                  Note d’information sous les horaires
                </label>
                <textarea
                  rows={2}
                  value={content.hoursNote}
                  onChange={(e) => updateField('hoursNote', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-[14px] text-white outline-none focus:border-white resize-none"
                />
              </div>

              <div className="divide-y divide-white/10 pt-2">
                {content.openingHours.map((h, idx) => (
                  <div key={h.day} className="py-2.5 flex items-center justify-between gap-4">
                    <span className="text-[14px] text-white/80 w-28">{h.day}</span>
                    <input
                      type="text"
                      value={h.hours}
                      onChange={(e) => updateOpeningHour(idx, 'hours', e.target.value)}
                      className="flex-1 bg-black/50 border border-white/20 rounded px-2.5 py-1 text-[13px] font-mono text-white outline-none focus:border-white text-right"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between bg-black/40">
          <button
            type="button"
            onClick={resetContent}
            className="text-[13px] text-white/50 hover:text-white underline underline-offset-4 transition-colors"
          >
            Rétablir les textes d’origine
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-black text-[14px] font-medium px-5 py-2 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
};
