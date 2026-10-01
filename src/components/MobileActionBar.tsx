import React from 'react';
import { Phone, Calendar } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface MobileActionBarProps {
  onNavigateAppointment: () => void;
  isChatOpen?: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  onNavigateAppointment,
  isChatOpen,
}) => {
  const { content } = useSiteContent();

  // If chat modal is open on mobile, hide the bottom action bar so there is zero overlap
  if (isChatOpen) {
    return null;
  }

  return (
    <div
      className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#07080a]/95 backdrop-blur-xl border-t border-white/10 px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom-2 duration-200"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
        {/* ACTION 1: APPELER LE GARAGE */}
        <a
          href={`tel:${content.phone}`}
          className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-full bg-white/10 active:bg-white/20 border border-white/15 text-white font-medium text-[14px] transition-colors font-mono cursor-pointer"
          title={`Appeler : ${content.phoneDisplay}`}
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>Appeler</span>
        </a>

        {/* ACTION 2: PRENDRE RENDEZ-VOUS */}
        <button
          type="button"
          onClick={onNavigateAppointment}
          className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-full bg-white active:bg-neutral-200 text-black font-semibold text-[14px] transition-colors cursor-pointer shadow-md"
        >
          <Calendar className="w-4 h-4" />
          <span>Prendre RDV</span>
        </button>
      </div>
    </div>
  );
};
