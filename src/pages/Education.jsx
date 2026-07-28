import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Education() {
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    if (window.updateFavicon) window.updateFavicon("educator");
  }, []);

  const subPages = [
    { title: "Atelier Sinnesküche", path: "/education/atelier-sinneskueche" },
    { title: "WIAM", path: "/education/wiam" },
    { title: "Gesangsküche", path: "/education/gesangskueche" },
    { title: t.choirProjects, path: "/education/chorprojekte" },
  ];

  const externalLinks = [
    { title: "jugendjazzorchester.ch", url: "https://jugendjazzorchester.ch" },
    {
      title: t.moodsCouncil,
      url: "https://www.moods.ch/das-moods/ueber-uns/team/musiker-innenrat",
    },
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
            color: "var(--education)",
            fontFamily: "BrandFont, sans-serif",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          {t.educator}
        </h1>
      </header>

      <main style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        <section>
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
                  borderLeft: "6px solid var(--education)",
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
        </section>

        <section>
          <h2
            style={{
              fontSize: "1rem",
              letterSpacing: "0.08em",
              opacity: 0.5,
              marginBottom: "1.5rem",
            }}
          >
            DIREKTE LINKS
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {externalLinks.map((ext) => (
              <a
                key={ext.title}
                href={ext.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--text)",
                  borderRadius: "30px",
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                {ext.title} ↗
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
