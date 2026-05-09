import { createContext, useState, useEffect, useContext } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const languages = ["EN", "DE", "FR"];

  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("userLanguage");
    if (savedLang && languages.includes(savedLang)) return savedLang;
    const browserLang = navigator.language.split("-")[0].toUpperCase();
    return languages.includes(browserLang) ? browserLang : "EN";
  });

  useEffect(() => {
    localStorage.setItem("userLanguage", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
