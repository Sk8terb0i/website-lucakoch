import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Journalism() {
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    if (window.updateFavicon) window.updateFavicon("journalist");
  }, []);

  const subPages = [
    { title: "audio", path: "/journalism/audio" },
    { title: t.articles, path: "/journalism/artikel" },
    { title: "TV", path: "/journalism/tv" },
  ];

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "12vh auto 8vh auto",
        padding: "2rem",
      }}
    >
      <header style={{ marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "3.5rem",
            color: "var(--journalism)",
            fontFamily: "BrandFont, sans-serif",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          {t.journalist}
        </h1>
      </header>

      <main>
        <h2
          style={{
            fontSize: "1rem",
            letterSpacing: "0.08em",
            opacity: 0.5,
            marginBottom: "1.5rem",
          }}
        >
          UNTERSEITEN
        </h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          {subPages.map((sub) => (
            <Link
              key={sub.title}
              to={sub.path}
              style={{
                padding: "1.25rem 1.5rem",
                backgroundColor: "var(--accent)",
                border: "1px solid var(--secondary)",
                borderLeft: "6px solid var(--journalism)",
                borderRadius: "8px",
                textDecoration: "none",
                color: "var(--text)",
                fontFamily: "Satoshi, sans-serif",
                fontSize: "1.2rem",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateX(6px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateX(0)")
              }
            >
              {sub.title}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
