import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Newsletter() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div style={{ maxWidth: "800px", margin: "15vh auto", padding: "2rem" }}>
      <h2
        style={{
          color: "var(--text)",
          fontFamily: "BrandFont, sans-serif",
          fontSize: "3rem",
          margin: 0,
        }}
      >
        {t.newsletter}
      </h2>
    </div>
  );
}
