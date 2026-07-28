import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

const educationItems = [{ id: 2, title: "Guest Lecture at Uni Zurich" }];

export default function Education() {
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    if (window.updateFavicon) {
      window.updateFavicon("educator");
    }
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "10vh auto", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            color: "var(--text)",
            textTransform: "lowercase",
            fontFamily: "BrandFont, sans-serif",
          }}
        >
          {t.siteTitle}
        </h1>
        <nav style={{ display: "flex", justifyContent: "center" }}>
          <Link
            to="/"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "var(--secondary)",
              color: "var(--text)",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "0.85rem",
              fontFamily: "Satoshi, sans-serif",
              textDecoration: "none",
            }}
          >
            {t.backToDesktop}
          </Link>
        </nav>
      </header>

      <main>
        <h2
          style={{
            borderBottom: "3px solid var(--education)",
            paddingBottom: "0.5rem",
            color: "var(--education)",
            textTransform: "lowercase",
            fontFamily: "BrandFont, sans-serif",
          }}
        >
          {t.education}
        </h2>

        <div style={{ display: "grid", gap: "1.5rem", marginTop: "2rem" }}>
          {educationItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "var(--accent)",
                border: "1px solid var(--secondary)",
                borderLeft: "8px solid var(--education)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "var(--text)",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                {item.title}
              </h3>
              <span
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  textTransform: "lowercase",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                {t.education}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
