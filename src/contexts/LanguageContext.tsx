import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  es: {
    'nav.triage': 'Triaje',
    'nav.pharmacy': 'Farmacias',
    'nav.search': 'Buscar',
    'nav.rewards': 'Premios',
    'nav.activity': 'Retos',
    'nav.history': 'Historial',
    'nav.appointments': 'Citas',
    'nav.membership': 'Membresía',
    'nav.dashboard': 'Panel',
    'header.emergency': 'Emergencia',
    'header.notifications': 'Notificaciones',
    'profile.title': 'Mi Perfil de Salud',
    'profile.settings': 'Ajustes',
    'settings.title': 'Ajustes y Personalización',
    'settings.subtitle': 'Gestiona como interactúas con la plataforma y su apariencia.',
    'settings.language': 'Idioma',
    'settings.appearance': 'Apariencia',
    'settings.theme.light': 'Modo Diurno',
    'settings.theme.dark': 'Modo Nocturno',
    'settings.notifications': 'Notificaciones',
    'settings.save': 'Guardar Cambios',
    'settings.saving': 'Guardando...',
    'wallet.title': 'Puntos de Salud',
    'wallet.balance': 'Balance Actual',
    'wallet.history': 'Historial Reciente',
    'wallet.rewards': 'Recompensas Premium',
    'hero.badge': 'SISTEMA DE SALUD PÚBLICA INTEGRAL',
    'hero.title': 'Eficiencia {empática} al servicio de tu salud.',
    'hero.subtitle': 'Transformamos la incertidumbre en rutas de acción verificadas. Triaje por IA, mapas de stock y pasaporte digital de salud.',
    'hero.cta.primary': 'Iniciar Triaje IA',
    'hero.cta.secondary': 'Protocolo Realon™',
    'features.title': 'Servicios Integrales',
    'features.1.title': 'Confiabilidad Institucional',
    'features.1.desc': 'Información verificada directamente de fuentes oficiales de salud pública.',
    'features.2.title': 'Eficiencia Empática',
    'features.2.desc': 'Diseñado para reducir tu carga mental en momentos de necesidad.',
    'features.3.title': 'Acceso Universal',
    'features.3.desc': 'Interfaz optimizada para máxima legibilidad y facilidad de uso.',
    'status.network': 'RED DE SALUD',
    'status.active': 'ACTIVA',
    'status.pharmacies': 'FARMACIAS 24H',
    'status.available': 'DISPONIBLES',
    'status.emergency': 'EMERGENCIAS',
    'status.call': 'LLAMAR',
    'cta.professional.title': '¿Eres un profesional de la salud o regente de farmacia?',
    'cta.professional.desc': 'Únete a la red interoperable {brand}. Registra tu laboratorio, clínica o farmacia para aparecer en el mapa de stock y disponibilidad en tiempo real.',
    'cta.professional.doctor': 'Soy Profesional',
    'cta.professional.clinic': 'Centro de Salud',
    'cta.professional.business': 'Laboratorio/Farmacia',
  },
  en: {
    'nav.triage': 'Triage',
    'nav.pharmacy': 'Pharmacies',
    'nav.search': 'Search',
    'nav.rewards': 'Rewards',
    'nav.activity': 'Challenges',
    'nav.history': 'History',
    'nav.appointments': 'Appointments',
    'nav.membership': 'Membership',
    'nav.dashboard': 'Dashboard',
    'header.emergency': 'Emergency',
    'header.notifications': 'Notifications',
    'profile.title': 'My Health Profile',
    'profile.settings': 'Settings',
    'settings.title': 'Settings & Customization',
    'settings.subtitle': 'Manage how you interact with the platform and its appearance.',
    'settings.language': 'Language',
    'settings.appearance': 'Appearance',
    'settings.theme.light': 'Light Mode',
    'settings.theme.dark': 'Dark Mode',
    'settings.notifications': 'Notifications',
    'settings.save': 'Save Changes',
    'settings.saving': 'Saving...',
    'wallet.title': 'Health Points',
    'wallet.balance': 'Current Balance',
    'wallet.history': 'Recent History',
    'wallet.rewards': 'Premium Rewards',
    'hero.badge': 'INTEGRAL PUBLIC HEALTH SYSTEM',
    'hero.title': 'Empathetic {efficiency} at your health\'s service.',
    'hero.subtitle': 'We transform uncertainty into verified action routes. AI Triage, stock maps, and digital health passport.',
    'hero.cta.primary': 'Start AI Triage',
    'hero.cta.secondary': 'Realon™ Protocol',
    'features.title': 'Comprehensive Services',
    'features.1.title': 'Institutional Reliability',
    'features.1.desc': 'Information verified directly from official public health sources.',
    'features.2.title': 'Empathetic Efficiency',
    'features.2.desc': 'Designed to reduce your mental load in times of need.',
    'features.3.title': 'Universal Access',
    'features.3.desc': 'Interface optimized for maximum readability and ease of use.',
    'status.network': 'HEALTH NETWORK',
    'status.active': 'ACTIVE',
    'status.pharmacies': '24H PHARMACIES',
    'status.available': 'AVAILABLE',
    'status.emergency': 'EMERGENCIES',
    'status.call': 'CALL',
    'cta.professional.title': 'Are you a healthcare professional or pharmacy manager?',
    'cta.professional.desc': 'Join the interoperable {brand} network. Register your lab, clinic or pharmacy to appear on the real-time stock and availability map.',
    'cta.professional.doctor': 'I am Professional',
    'cta.professional.clinic': 'Health Center',
    'cta.professional.business': 'Lab/Pharmacy',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
