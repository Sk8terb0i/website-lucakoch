import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  useEffect(() => {
    const handleZoom = (e) => setIsZoomedIn(e.detail);
    window.addEventListener("zoomStateChange", handleZoom);
    return () => window.removeEventListener("zoomStateChange", handleZoom);
  }, []);

  const getMarkerStyle = (rotation) => ({
    fontSize: "0.8rem",
    color: isZoomedIn ? "var(--text)" : "var(--background)",
    textTransform: "lowercase",
    fontFamily: "'Satoshi', sans-serif",
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
      }}
    >
      {/* THE THIN DELINEATION LINE */}
      <div
        style={{
          height: "1px",
          backgroundColor: isZoomedIn ? "var(--text)" : "var(--background)",
          transition: "background-color 0.8s ease-in-out",
          opacity: 0.2,
          margin: "0 2.5rem",
        }}
      />

      {/* FOOTER TEXT LINKS */}
      <div
        style={{
          padding: "1.5rem 2.5rem",
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
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
