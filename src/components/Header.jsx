import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Header() {
  const { lang, setLang, languages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeIndex = languages.indexOf(lang);
  const t = translations[lang];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

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

  // Lock background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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

  const dynamicColor =
    isHome && !isZoomedIn ? "var(--background)" : "var(--text)";

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
          // Hardware acceleration fixes mobile position-fixed scroll jitter
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "1.25rem" : "2.5rem",
            pointerEvents: "auto",
            flexShrink: 0,
          }}
        >
          {/* LANGUAGE SWITCHER CONTAINER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              gap: "12px",
              opacity: isMenuOpen ? 0 : 1,
              pointerEvents: isMenuOpen ? "none" : "auto",
              transition: "opacity 0.3s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "-4px",
                left: "10px",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: dynamicColor,
                transform: `translateX(${activeIndex * 36}px)`,
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
                  fontFamily: "'BrandFont', sans-serif",
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
              gap: "5px",
              padding: "0",
              zIndex: 60,
              transition: "transform 0.3s ease, opacity 0.3s ease",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "2px",
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
                width: "18px",
                height: "2px",
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

      {/* DIMMER */}
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
          // Block ALL interactions underneath it when the menu is active
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

      {/* SIDEBAR */}
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
          // Strictly force pointerEvents to 'auto' to ensure the menu captures clicks,
          // while the background is protected by the dimmer logic.
          pointerEvents: isMenuOpen ? "auto" : "none",
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
                  // Override delay to 0s and speed up the animation to 0.15s
                  e.currentTarget.style.transition = "all 0.15s ease 0s";
                  e.currentTarget.style.transform =
                    "translateX(15px) scale(1.02)";
                  e.currentTarget.style.opacity = isCoreTopic ? 0.7 : 0.6;
                }}
                onMouseOut={(e) => {
                  // Fast snap back to original position
                  e.currentTarget.style.transition = "all 0.2s ease 0s";
                  e.currentTarget.style.transform = "translateX(0) scale(1)";
                  e.currentTarget.style.opacity = 1;
                }}
              >
                <span
                  style={{
                    fontFamily: "'BrandFont', sans-serif",
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
                      : "1.6rem",
                    fontWeight: isCoreTopic ? "700" : "400",
                    color: isCoreTopic ? `var(--${item})` : "var(--text)",
                    fontFamily: "'BrandFont', sans-serif",
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
