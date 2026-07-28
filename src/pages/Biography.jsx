import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Biography() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div style={{ maxWidth: "800px", margin: "15vh auto", padding: "2rem" }}>
      <h2
        style={{
          color: "var(--text)",
          fontFamily: "BrandFont, sans-serif",
          textTransform: "lowercase",
          borderBottom: "3px solid var(--primary)",
          paddingBottom: "0.5rem",
        }}
      >
        {t.biography}
      </h2>
      <p style={{ fontFamily: "Satoshi, sans-serif", lineHeight: "1.6" }}>
        This is where your biography text will go.
      </p>
    </div>
  );
}
