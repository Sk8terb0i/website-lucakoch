import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const linkStyle = {
    fontSize: "0.8rem", // Slightly smaller for Satoshi
    color: "var(--text)",
    textTransform: "lowercase",
    fontFamily: "'Satoshi', sans-serif", // Switched to Satoshi
    letterSpacing: "0.08em", // Satoshi loves a bit of extra tracking
    transition: "opacity 0.2s ease",
    pointerEvents: "auto",
    cursor: "pointer",
    fontWeight: "normal",
  };

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        pointerEvents: "none",
        opacity: 0.75, // Matching your header opacity
      }}
    >
      {/* THE THIN DELINEATION LINE */}
      <div
        style={{
          height: "1px",
          backgroundColor: "var(--text)",
          opacity: 0.15,
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
          style={linkStyle}
          onMouseOver={(e) => (e.target.style.opacity = 0.5)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
        >
          instagram
        </a>

        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
          onMouseOver={(e) => (e.target.style.opacity = 0.5)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
        >
          tiktok
        </a>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
          onMouseOver={(e) => (e.target.style.opacity = 0.5)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
        >
          youtube
        </a>
      </div>
    </footer>
  );
}
