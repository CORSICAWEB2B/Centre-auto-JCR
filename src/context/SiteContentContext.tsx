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

export const DEFAULT_SITE_CONTENT: SiteContent = defaultData as unknown as SiteContent;

const STORAGE_KEY = 'centre_auto_jcr_content_v1';

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
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(saved) };
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
