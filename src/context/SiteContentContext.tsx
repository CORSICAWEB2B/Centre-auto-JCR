import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultData from '../data/siteContentData.json';

export interface ServiceItem {
  id: string;
  num: string;
  name: string;
  description: string;
}

export interface HourItem {
  day: string;
  hours: string;
  open: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  source: string;
  badge?: string;
}

export interface SiteContent {
  brandName: string;
  phone: string;
  phoneDisplay: string;
  introLine1: string;
  introLine2: string;
  typewriterText: string;
  pillAppointment: string;
  pillServices: string;
  pillLocation: string;
  pillHours: string;
  pillCallPrefix: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  hoursNote: string;
  servicesTitle: string;
  servicesSubtitle: string;
  appointmentTitle: string;
  appointmentSubtitle: string;
  locationTitle: string;
  hoursTitle: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  reviewsRatingText: string;
  services: ServiceItem[];
  openingHours: HourItem[];
  reviews: ReviewItem[];
}

export const AUTHENTIC_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Ange-antoine Ferrandi',
    date: 'Il y a 2 semaines',
    rating: 5,
    text: "J'ai trouvé un garage sérieux tenu par un patron jeune, compétent et très sympathique.J'y suis allé pour une vidange de boîte automatique sur une Mercedes CLK .Le travail a été fait sérieusement et à un prix très correct.Il n'a pas manqué de me diagnostiquer quelques problèmes que je connaissais sur ma voiture .Je suis parti rassuré et content d'avoir trouvé un garage sérieux. Je le recommande vivement!",
    source: 'Google',
    badge: 'Avis vérifié',
  },
  {
    id: 'rev-2',
    author: 'Radek Gothard',
    date: 'Il y a 1 mois',
    rating: 5,
    text: "En descendant du bateau, nous avons trouvé un boulon dans la roue avant de notre voiture. La roue tournait au ralenti, alors je suis allé au Centre Auto JCR. L'accueil du mécanicien, souriant et très sympathique, a été impeccable. La roue a été réparée en 10 minutes et nous avons pu reprendre nos vacances en Corse. Un service irréprochable et une réactivité exemplaire. Merci !",
    source: 'Google',
    badge: 'Avis vérifié',
  },
  {
    id: 'rev-3',
    author: 'D Müller',
    date: 'Il y a 2 mois',
    rating: 5,
    text: "Nous étions en pleine préparation de nos vacances en Corse, mais mon porte-vélos en a décidé autrement. Mon feu arrière droit a cessé de fonctionner et les fils dénudés étaient un vrai fouillis.\n\nDans ce garage, nous avons bénéficié d'une assistance immédiate, aimable et efficace. Avec patience, expertise et une intuition quasi-détective, ils ont démêlé, testé et reconnecté les fils correctement. Finalement, tout a fonctionné à merveille ! Un service chaleureux, une aide compétente et une persévérance admirable. Grâce à ce garage, nous avons pu poursuivre nos vacances sans encombre et reprendre la route en toute sécurité. Je le recommande vivement ! Un grand merci ! :-)))",
    source: 'Google',
    badge: 'Avis vérifié',
  },
  {
    id: 'rev-4',
    author: 'Lucia Weis',
    date: 'Il y a 3 mois',
    rating: 5,
    text: "Nous sommes un groupe de campeuses, et l'une d'entre nous avait un problème avec le support de son porte-vélos. Il l'a réparé avec patience et persévérance, et tout fonctionne parfaitement. Le prix était raisonnable, il était incroyablement sympathique, et le travail a été bien fait. Nous étions toutes les quatre ravies.",
    source: 'Google',
    badge: 'Avis vérifié',
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  ...(defaultData as unknown as SiteContent),
  reviews: AUTHENTIC_REVIEWS,
};

const STORAGE_KEY = 'centre_auto_jcr_content_v2';

interface SiteContentContextType {
  content: SiteContent;
  isEditing: boolean;
  toggleEditing: () => void;
  updateField: (field: keyof SiteContent, value: any) => void;
  updateService: (index: number, key: keyof ServiceItem, value: string) => void;
  updateOpeningHour: (index: number, key: keyof HourItem, value: any) => void;
  updateReview: (index: number, key: keyof ReviewItem, value: any) => void;
  resetContent: () => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    // Purge legacy storage from previous test deployments that might hold fake reviews
    try {
      localStorage.removeItem('centre_auto_jcr_content_v1');
    } catch {
      // Ignore
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const VALID_AUTHORS = new Set(AUTHENTIC_REVIEWS.map((r) => r.author));
        if (parsed.reviews && Array.isArray(parsed.reviews)) {
          // Whitelist: strictly allow only verified authentic reviews
          parsed.reviews = parsed.reviews.filter((r: any) => VALID_AUTHORS.has(r.author));
          if (parsed.reviews.length === 0) {
            parsed.reviews = AUTHENTIC_REVIEWS;
          }
        } else {
          parsed.reviews = AUTHENTIC_REVIEWS;
        }
        return { ...DEFAULT_SITE_CONTENT, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Sync client-side localStorage to persistent disk file so GitHub and Cloudflare have authentic content
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        fetch('/api/sync-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: saved,
        }).catch(() => {});
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to localStorage on change and sync to file in dev environment
  useEffect(() => {
    try {
      const serialized = JSON.stringify(content);
      localStorage.setItem(STORAGE_KEY, serialized);
      fetch('/api/sync-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: serialized,
      }).catch(() => {});
    } catch {
      // Ignore quota errors
    }
  }, [content]);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const updateField = (field: keyof SiteContent, value: any) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateService = (index: number, key: keyof ServiceItem, value: string) => {
    setContent((prev) => {
      const nextServices = [...prev.services];
      if (nextServices[index]) {
        nextServices[index] = { ...nextServices[index], [key]: value };
      }
      return { ...prev, services: nextServices };
    });
  };

  const updateOpeningHour = (index: number, key: keyof HourItem, value: any) => {
    setContent((prev) => {
      const nextHours = [...prev.openingHours];
      if (nextHours[index]) {
        nextHours[index] = { ...nextHours[index], [key]: value };
      }
      return { ...prev, openingHours: nextHours };
    });
  };

  const updateReview = (index: number, key: keyof ReviewItem, value: any) => {
    setContent((prev) => {
      const nextReviews = [...(prev.reviews || DEFAULT_SITE_CONTENT.reviews)];
      if (nextReviews[index]) {
        nextReviews[index] = { ...nextReviews[index], [key]: value };
      }
      return { ...prev, reviews: nextReviews };
    });
  };

  const resetContent = () => {
    setContent(DEFAULT_SITE_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        isEditing,
        toggleEditing,
        updateField,
        updateService,
        updateOpeningHour,
        updateReview,
        resetContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
