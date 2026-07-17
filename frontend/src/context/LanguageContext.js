import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../i18n/en.json';
import fr from '../i18n/fr.json';
import ar from '../i18n/ar.json';

const translations = { en, fr, ar };

const RATES = { MAD: 1, EUR: 10.7, USD: 10.0 };

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('user_preferences'));
      return saved?.language || 'en';
    } catch { return 'en'; }
  });

  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('user_preferences'));
      return saved?.currency || 'MAD';
    } catch { return 'MAD'; }
  });

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      const saved = JSON.parse(localStorage.getItem('user_preferences')) || {};
      saved.language = newLang;
      localStorage.setItem('user_preferences', JSON.stringify(saved));
    } catch {}
  }, []);

  const setCurrency = useCallback((newCurrency) => {
    setCurrencyState(newCurrency);
    try {
      const saved = JSON.parse(localStorage.getItem('user_preferences')) || {};
      saved.currency = newCurrency;
      localStorage.setItem('user_preferences', JSON.stringify(saved));
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  }, [lang]);

  const formatPrice = useCallback((price, targetCurrency) => {
    if (price == null || price === '') return t('price_na');
    const num = Number(price);
    if (isNaN(num)) return t('price_na');
    const cur = targetCurrency || currency || 'MAD';
    const rate = RATES[cur] || 1;
    const converted = num / rate;
    try {
      const formatted = converted.toLocaleString(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      return `${formatted} ${cur}`;
    } catch {
      return `${converted} ${cur}`;
    }
  }, [lang, currency]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currency, setCurrency, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};
