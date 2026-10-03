"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLocale, SUPPORTED_LOCALES, UI_TRANSLATIONS } from "@/lib/i18n";

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "de",
  setLocale: () => {},
  t: (key: string) => key
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("de");

  useEffect(() => {
    const saved = localStorage.getItem("devforge_preferred_locale") as SupportedLocale;
    if (saved && SUPPORTED_LOCALES.some(l => l.code === saved)) {
      // Read persisted preferences after hydration to avoid a server/client locale mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem("devforge_preferred_locale", newLocale);
  };

  const t = (key: string): string => {
    return UI_TRANSLATIONS[locale]?.[key] || UI_TRANSLATIONS.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
