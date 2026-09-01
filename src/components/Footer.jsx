import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  const dynamicColor =
    isHome && !isZoomedIn ? "var(--background)" : "var(--text)";

  const getMarkerStyle = (rotation) => ({
    fontSize: isMobile ? "0.9rem" : "1rem",
    color: dynamicColor,
    textTransform: "lowercase",
    fontFamily: "'BrandFont', sans-serif",
    letterSpacing: "0.08em",
    transition:
      "color 0.8s ease-in-out, opacity 0.2s ease, transform 0.2s ease",
    pointerEvents: "auto",
    cursor: "pointer",
    fontWeight: "normal",
    display: "inline-block",
    transform: `rotate(${rotation})`,
  });

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        pointerEvents: "none",
        opacity: 0.75,
        // Hardware acceleration fixes mobile position-fixed scroll jitter
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      {/* THE THIN DELINEATION LINE */}
      <div
        style={{
          height: "1px",
          backgroundColor: dynamicColor,
          transition: "background-color 0.8s ease-in-out",
          opacity: 0.2,
          margin: isMobile ? "0 1rem" : "0 2.5rem",
        }}
      />

      {/* FOOTER TEXT LINKS */}
      <div
        style={{
          padding: isMobile ? "1rem 1rem" : "1.5rem 2.5rem",
          display: "flex",
          justifyContent: "center",
          gap: isMobile ? "1.5rem" : "3rem",
        }}
      >
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          style={getMarkerStyle("0.5deg")}
          onMouseOver={(e) => (e.target.style.opacity = 0.5)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
        >
          instagram
        </a>

        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          style={getMarkerStyle("-0.4deg")}
          onMouseOver={(e) => (e.target.style.opacity = 0.5)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
        >
          tiktok
        </a>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          style={getMarkerStyle("0.6deg")}
          onMouseOver={(e) => (e.target.style.opacity = 0.5)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
        >
          youtube
        </a>
      </div>
    </footer>
  );
}
