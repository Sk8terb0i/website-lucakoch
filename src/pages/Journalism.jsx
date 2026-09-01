import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Journalism() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [latestItems, setLatestItems] = useState({
    artikel: null,
    audio: null,
    tv: null,
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.updateFavicon) window.updateFavicon("journalist");

    const fetchLatestItems = async () => {
      try {
        const categories = ["artikel", "audio", "tv"];
        const results = {};

        for (const cat of categories) {
          const q = query(
            collection(db, "journalism_links"),
            where("category", "==", cat),
            orderBy("date", "desc"),
            limit(1),
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            results[cat] = { id: doc.id, ...doc.data() };
          }
        }

        setLatestItems(results);
      } catch (error) {
        console.error("Error fetching latest journalism items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestItems();
  }, []);

  const formatDateMeta = (dateStr, langTag) => {
    if (!dateStr) return langTag || "";
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}.${month}.${year} — ${langTag || "DE"}`;
  };

  const sections = [
    { key: "artikel", title: t.articles, path: "/journalism/artikel" },
    { key: "audio", title: t.audio, path: "/journalism/audio" },
    { key: "tv", title: t.tv, path: "/journalism/tv" },
  ];

  return (
    <>
      {/* Top Mask for Fixed Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: isMobile ? "5vhpx" : "7vh",
          backgroundColor: "var(--background)",
          zIndex: 45,
          pointerEvents: "none",
        }}
      />

      {/* Bottom Mask for Fixed Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: isMobile ? "5vh" : "5vh",
          backgroundColor: "var(--background)",
          zIndex: 45,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: isMobile ? "100px 16px 100px" : "160px 24px 120px",
          backgroundColor: "var(--background)",
          color: "var(--text)",
          boxSizing: "border-box",
        }}
      >
        {/* Main Title */}
        <h1
          style={{
            fontFamily: "'BrandFont', sans-serif",
            fontSize: isMobile ? "2.2rem" : "3.2rem",
            fontWeight: "normal",
            margin: isMobile ? "0 0 32px 0" : "0 0 60px 0",
            color: "var(--text)",
          }}
        >
          {t.journalism || t.journalist}
        </h1>

        {/* Category Sections */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "32px" : "60px",
          }}
        >
          {sections.map(({ key, title, path }) => {
            const item = latestItems[key];

            return (
              <section
                key={key}
                style={{
                  borderTop: "1px solid var(--text)",
                  paddingTop: isMobile ? "16px" : "24px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
                    gap: isMobile ? "12px" : "20px",
                  }}
                >
                  {/* Category Title Column */}
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: isMobile ? "1.5rem" : "2rem",
                        fontWeight: "400",
                        lineHeight: "1.1",
                        color: "var(--text)",
                      }}
                    >
                      {title}
                    </h2>
                  </div>

                  {/* Category Content Column */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isMobile ? "8px" : "20px",
                    }}
                  >
                    {/* Render recent item ONLY on desktop */}
                    {!isMobile &&
                      (loading ? (
                        <p style={{ color: "var(--primary)", margin: 0 }}>
                          {t.loading}
                        </p>
                      ) : item ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {/* Meta Row */}
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--primary)",
                              letterSpacing: "0.3px",
                            }}
                          >
                            {formatDateMeta(item.date, item.language)}
                          </div>

                          {/* Title with Yellow Hover Underline */}
                          <h3 style={{ margin: 0, lineHeight: "1.3" }}>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: "var(--text)",
                                textDecoration: "none",
                                fontSize: "1.35rem",
                                fontWeight: "400",
                                borderBottom: "2px solid transparent",
                                transition: "border-color 0.25s ease",
                                display: "inline",
                                wordBreak: "break-word",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.borderBottomColor =
                                  "var(--journalism)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.borderBottomColor =
                                  "transparent")
                              }
                            >
                              {item.title}
                            </a>
                          </h3>

                          {/* Description */}
                          {item.description && (
                            <p
                              style={{
                                margin: "4px 0 0 0",
                                fontSize: "0.95rem",
                                lineHeight: "1.5",
                                color: "var(--primary)",
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p
                          style={{
                            color: "var(--primary)",
                            fontStyle: "italic",
                            margin: 0,
                          }}
                        >
                          {t.noItems}
                        </p>
                      ))}

                    {/* Discover More Subpage Link (Rendered on both mobile and desktop) */}
                    <div style={{ marginTop: isMobile ? "0" : "8px" }}>
                      <Link
                        to={path}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "var(--text)",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          borderBottom: "1px solid var(--secondary)",
                          paddingBottom: "2px",
                          transition:
                            "border-color 0.25s ease, opacity 0.25s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.borderColor =
                            "var(--journalism)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.borderColor =
                            "var(--secondary)")
                        }
                      >
                        Discover all {title.toLowerCase()} →
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
