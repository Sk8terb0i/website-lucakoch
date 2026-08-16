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
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  // Handle Resize & Zoom State
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleZoom = (e) => setIsZoomedIn(e.detail);

    window.addEventListener("resize", handleResize);
    window.addEventListener("zoomStateChange", handleZoom);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("zoomStateChange", handleZoom);
    };
  }, []);

  const menuItems = [
    "art",
    "education",
    "journalism",
    "biography",
    "media",
    "newsletter",
    "calendar",
    "contact",
    "shop",
  ];

  const DESKTOP_WIDTH = "450px";

  // Dynamic colors based on zoom state
  const dynamicColor = isZoomedIn ? "var(--text)" : "var(--background)";

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: isMobile ? "1rem 1rem" : "2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 60,
          pointerEvents: "none",
        }}
      >
        {/* LEFT: SITE TITLE */}
        <div style={{ pointerEvents: "auto", flexShrink: 1, minWidth: 0 }}>
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
                fontSize: isMobile ? "1.5rem" : "2rem",
                fontWeight: "500",
                letterSpacing: "0.05em",
                color: dynamicColor,
                fontFamily: "BrandFont, sans-serif",
                display: "inline-block",
                transform: "rotate(-0.6deg)",
                whiteSpace: "nowrap",
                transition: "color 0.8s ease-in-out",
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
            gap: isMobile ? "1.25rem" : "2.5rem",
            pointerEvents: "auto",
            flexShrink: 0,
          }}
        >
          {/* SUBTLE LANGUAGE TOGGLE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              gap: "12px",
            }}
          >
            {/* The sliding dot indicator */}
            <div
              style={{
                position: "absolute",
                bottom: "-4px",
                left: "10px", // Centers the 4px dot under the 24px text block
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: dynamicColor,
                transform: `translateX(${activeIndex * 36}px)`, // 24px width + 12px gap
                transition:
                  "background-color 0.8s ease-in-out, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            {languages.map((l) => (
              <div
                key={l}
                onClick={() => setLang(l)}
                onMouseOver={(e) => {
                  if (lang !== l) e.currentTarget.style.opacity = 0.7;
                }}
                onMouseOut={(e) => {
                  if (lang !== l) e.currentTarget.style.opacity = 0.4;
                }}
                style={{
                  width: "24px",
                  textAlign: "center",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: lang === l ? "700" : "500",
                  color: dynamicColor,
                  opacity: lang === l ? 1 : 0.4,
                  transition: "color 0.8s ease-in-out, opacity 0.3s ease",
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
              gap: "7px",
              padding: "0",
              zIndex: 60,
              transition: "transform 0.3s ease, opacity 0.3s ease",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "2.5px",
                borderRadius: "2px",
                backgroundColor: dynamicColor,
                transition:
                  "background-color 0.8s ease-in-out, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                transform: isMenuOpen
                  ? "translateY(4.75px) rotate(45deg)"
                  : "none",
              }}
            />
            <div
              style={{
                width: "24px",
                height: "2.5px",
                borderRadius: "2px",
                backgroundColor: dynamicColor,
                transition:
                  "background-color 0.8s ease-in-out, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
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
          backgroundColor: isMobile
            ? "rgba(255, 247, 252, 0.9)"
            : "rgba(255, 247, 252, 0.15)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRight: "1px solid rgba(223, 217, 232, 0.5)",
          zIndex: 54,
          pointerEvents: isMenuOpen ? "auto" : "none",
          visibility: isMenuOpen ? "visible" : "hidden",
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
            ? "rgba(255, 247, 252, 0.98)"
            : "rgba(255, 247, 252, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderLeft: "1px solid rgba(223, 217, 232, 0.5)",
          zIndex: 55,
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "8rem 2rem 3rem 2rem" : "8rem 4rem 3rem 4rem",
          overflowY: "auto",
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
