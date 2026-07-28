import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Header() {
  const { lang, setLang, languages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeIndex = languages.indexOf(lang);
  const t = translations[lang];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    "biography",
    "art",
    "education",
    "journalism",
    "media",
    "newsletter",
    "calendar",
    "contact",
    "shop",
  ];

  const DESKTOP_WIDTH = "450px";

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 60,
          pointerEvents: "none",
        }}
      >
        {/* LEFT: SITE TITLE */}
        <div style={{ pointerEvents: "auto" }}>
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            style={{
              textDecoration: "none",
              display: "inline-block",
              transition: "transform 0.3s ease, opacity 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = 0.6;
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: "normal",
                letterSpacing: "0.05em",
                color: "var(--text)",
                fontFamily: "BrandFont, sans-serif",
                paddingTop: "4px",
              }}
            >
              {t.siteTitle}
            </h1>
          </Link>
        </div>

        {/* RIGHT: LANGUAGE TOGGLE & HAMBURGER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            pointerEvents: "auto",
          }}
        >
          {/* LANGUAGE TOGGLE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              border: "1px solid var(--text)",
              borderRadius: "30px",
              padding: "4px",
              backgroundColor: "var(--background)",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "24px",
                height: "24px",
                backgroundColor: "var(--text)",
                borderRadius: "50%",
                transform: `translateX(${activeIndex * 100}%)`,
                transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            {languages.map((l) => (
              <div
                key={l}
                onClick={() => setLang(l)}
                onMouseOver={(e) => {
                  if (lang !== l) e.currentTarget.style.opacity = 0.5;
                }}
                onMouseOut={(e) => {
                  if (lang !== l) e.currentTarget.style.opacity = 1;
                }}
                style={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  cursor: "pointer",
                  fontSize: "0.65rem",
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: "700",
                  color: lang === l ? "var(--background)" : "var(--text)",
                  transition: "color 0.4s, opacity 0.2s ease",
                }}
              >
                {l}
              </div>
            ))}
          </div>

          {/* HAMBURGER MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.opacity = 0.7;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.opacity = 1;
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "0",
              zIndex: 60,
              transition: "transform 0.3s ease, opacity 0.3s ease",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "1.5px",
                backgroundColor: "var(--text)",
                transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                transform: isMenuOpen
                  ? "translateY(4.75px) rotate(45deg)"
                  : "none",
              }}
            />
            <div
              style={{
                width: "24px",
                height: "1.5px",
                backgroundColor: "var(--text)",
                transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                transform: isMenuOpen
                  ? "translateY(-4.75px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* BACKGROUND DIMMER / LEFT GLASS PANEL */}
      <div
        onClick={() => setIsMenuOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: isMobile ? 0 : DESKTOP_WIDTH,
          backgroundColor: "rgba(0,0,0,0.15)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          zIndex: 54,
          pointerEvents: isMenuOpen ? "auto" : "none",
          visibility: isMenuOpen ? "visible" : "hidden",
          /* On mobile: Fade smoothly in place. On desktop: Slide in from the left */
          opacity: isMobile ? (isMenuOpen ? 1 : 0) : 1,
          transform: isMobile
            ? "none"
            : isMenuOpen
              ? "translateX(0)"
              : "translateX(-100%)",
          transition: isMobile
            ? "opacity 0.4s ease, visibility 0.4s ease"
            : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.5s",
        }}
      />

      {/* SIDEBAR DRAWER / RIGHT PANEL */}
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          right: 0,
          width: isMobile ? "100vw" : DESKTOP_WIDTH,
          boxSizing: "border-box",
          backgroundColor: isMobile
            ? "rgba(255, 247, 252, 0.9)"
            : "rgba(255, 247, 252, 0.15)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderLeft: "1px solid rgba(223, 217, 232, 0.5)",
          zIndex: 55,
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "8rem 2rem 3rem 2rem" : "8rem 4rem 3rem 4rem",
          overflowY: "auto",
          /* Pure slide from the right side */
          transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            textAlign: "left",
          }}
        >
          {menuItems.map((item, index) => {
            const isCoreTopic = ["art", "education", "journalism"].includes(
              item,
            );

            return (
              <Link
                key={item}
                to={`/${item}`}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                  display: "inline-flex",
                  alignItems: "baseline",
                  transformOrigin: "left center",
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? "translateX(0)" : "translateX(20px)",
                  transitionDelay: `${isMenuOpen ? index * 0.04 : 0}s`,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform =
                    "translateX(15px) scale(1.02)";
                  e.currentTarget.style.opacity = isCoreTopic ? 0.7 : 0.6;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateX(0) scale(1)";
                  e.currentTarget.style.opacity = 1;
                }}
              >
                {/* The fixed-width Number Prefix */}
                <span
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "var(--text)",
                    opacity: 0.3,
                    minWidth: "2.5rem",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* The actual Link Text */}
                <span
                  style={{
                    fontSize: isCoreTopic
                      ? isMobile
                        ? "3.2rem"
                        : "3.5rem"
                      : "1.2rem",
                    fontWeight: isCoreTopic ? "700" : "400",
                    color: isCoreTopic ? `var(--${item})` : "var(--text)",
                    fontFamily: isCoreTopic
                      ? "'BrandFont', sans-serif"
                      : "'Satoshi', sans-serif",
                    textTransform: "lowercase",
                  }}
                >
                  {t[item]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
