import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('lang');
    return savedLang === 'tr' || savedLang === 'en' ? savedLang : 'tr';
  });

  const changeLanguage = (lang) => {
    if (lang === 'tr' || lang === 'en') {
      setLanguage(lang);
      localStorage.setItem('lang', lang);
    }
  };

  // Helper to translate key path e.g. "navbar.home"
  const t = useCallback((keyPath) => {
    const keys = keyPath.split('.');
    let result = translations[language];

    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        console.warn(`Translation key not found: "${keyPath}" for language "${language}"`);
        return keyPath; // fallback to key path itself
      }
    }
    return result;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
