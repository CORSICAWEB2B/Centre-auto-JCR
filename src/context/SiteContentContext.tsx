import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brandName: 'Centre Auto JCR',
  phone: '0495334730',
  phoneDisplay: '04 95 33 47 30',
  introLine1: 'Centre Auto JCR, Bastia',
  introLine2: 'Entretien, réparation et diagnostic automobile',
  typewriterText:
    'Un bruit étrange, un voyant allumé ou simplement votre entretien à prévoir ? Dites-nous ce qu’il se passe.',
  pillAppointment: 'Prendre rendez-vous',
  pillServices: 'Voir nos services',
  pillLocation: 'Nous trouver',
  pillHours: 'Voir les horaires',
  pillCallPrefix: 'Appeler :',
  addressLine1: 'Zone industrielle de Furiani',
  addressLine2: 'Rue François Lota',
  addressLine3: '20600 Bastia',
  hoursNote:
    'Accueil avec ou sans rendez-vous selon la nature des interventions et la disponibilité de l’atelier.',
  servicesTitle: 'Services & Prestations',
  servicesSubtitle:
    'Un savoir-faire mécanique complet pour tous types de véhicules, assuré par des techniciens qualifiés à Bastia.',
  appointmentTitle: 'Prendre rendez-vous',
  appointmentSubtitle:
    'Indiquez-nous la nature de votre besoin ou contactez-nous directement par téléphone.',
  locationTitle: 'Accès & Coordonnées',
  hoursTitle: 'Horaires d’ouverture',
  services: [
    {
      id: 'entretien',
      num: '01',
      name: 'Entretien automobile',
      description:
        'Vidange, révision constructeur, remplacement des filtres et contrôles des niveaux de sécurité.',
    },
    {
      id: 'mecanique',
      num: '02',
      name: 'Réparation mécanique',
      description:
        'Intervention sur moteur, embrayage, boîte de vitesses, suspensions et organes de roulement.',
    },
    {
      id: 'pneumatiques',
      num: '03',
      name: 'Pneumatiques',
      description:
        'Montage, équilibrage, géométrie des trains roulants, contrôle d’usure et remplacement.',
    },
    {
      id: 'freinage',
      num: '04',
      name: 'Freinage',
      description:
        'Disques, plaquettes, étriers, liquide de frein et contrôle d’efficacité du circuit hydraulique.',
    },
    {
      id: 'distribution',
      num: '05',
      name: 'Distribution',
      description:
        'Remplacement kit courroie de distribution, pompe à eau et courroie d’accessoires selon préconisations.',
    },
    {
      id: 'diagnostic',
      num: '06',
      name: 'Diagnostic automobile',
      description:
        'Recherche de pannes électroniques, lecture des calculateurs et identification des voyants moteur.',
    },
    {
      id: 'climatisation',
      num: '07',
      name: 'Climatisation',
      description:
        'Recharge en fluide frigorigène, détection de fuite, traitement antibactérien et filtre habitacle.',
    },
  ],
  openingHours: [
    { day: 'Lundi', hours: '08:30–18:30', open: true },
    { day: 'Mardi', hours: '08:30–18:30', open: true },
    { day: 'Mercredi', hours: '08:30–18:30', open: true },
    { day: 'Jeudi', hours: '08:30–18:30', open: true },
    { day: 'Vendredi', hours: '08:30–18:30', open: true },
    { day: 'Samedi', hours: 'Fermé', open: false },
    { day: 'Dimanche', hours: 'Fermé', open: false },
  ],
  reviewsTitle: 'Avis clients certifiés',
  reviewsSubtitle:
    'Retours d’expérience de nos clients sur la qualité du diagnostic, l’accueil et le suivi mécanique au Centre Auto JCR.',
  reviewsRatingText: '4,8/5 sur Google',
  reviews: [
    {
      id: 'rev-1',
      author: 'Antonia M.',
      date: 'Il y a 2 semaines',
      rating: 5,
      text: 'Prise en charge rapide et diagnostic très honnête. Pas de mauvaise surprise sur la facture, équipe sérieuse et accueillante. Je recommande les yeux fermés à Bastia !',
      source: 'Google',
      badge: 'Avis vérifié',
    },
    {
      id: 'rev-2',
      author: 'Sébastien L.',
      date: 'Il y a 1 mois',
      rating: 5,
      text: 'Très bon garage à Furiani. Révision complète et remplacement des freins effectués dans la journée. Professionnalisme au top et explications limpides.',
      source: 'Google',
      badge: 'Avis vérifié',
    },
    {
      id: 'rev-3',
      author: 'Marie-Claire P.',
      date: 'Il y a 2 mois',
      rating: 5,
      text: 'Dépannage d’urgence pour un voyant moteur avant de prendre le ferry. Ils ont été réactifs, rassurants et ultra pro. Un grand merci à toute l’équipe !',
      source: 'Google',
      badge: 'Avis vérifié',
    },
    {
      id: 'rev-4',
      author: 'David G.',
      date: 'Il y a 3 mois',
      rating: 5,
      text: 'Client fidèle depuis plusieurs années. Toujours arrangeants, tarifs justes et travail soigné sur ma boîte de vitesses et ma courroie de distribution.',
      source: 'Google',
      badge: 'Avis vérifié',
    },
  ],
};

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

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
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
