import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Header() {
  const { lang, setLang, languages } = useLanguage();
  const activeIndex = languages.indexOf(lang);
  const t = translations[lang]; // Shortcut to current translations

  return (
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
        zIndex: 50,
        pointerEvents: "none",
        opacity: 0.95,
      }}
    >
      {/* LEFT: SITE TITLE */}
      <div style={{ pointerEvents: "auto" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: "normal",
            letterSpacing: "0.05em",
            color: "var(--text)",
          }}
        >
          Luca Koch Portfolio
        </h1>
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
          }}
        >
          {/* The Sliding Solid Circle */}
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

          {/* The Text Labels */}
          {languages.map((l) => (
            <div
              key={l}
              onClick={() => setLang(l)}
              style={{
                width: "24px",
                height: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                cursor: "pointer",
                fontSize: "0.7rem",
                fontWeight: "normal",
                color: lang === l ? "var(--background)" : "var(--text)",
                transition: "color 0.4s",
              }}
            >
              {l}
            </div>
          ))}
        </div>

        {/* HAMBURGER MENU */}
        <button
          onClick={() => alert("Menu opened!")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "0",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "1.5px",
              backgroundColor: "var(--text)",
            }}
          />
          <div
            style={{
              width: "24px",
              height: "1.5px",
              backgroundColor: "var(--text)",
            }}
          />
        </button>
      </div>
    </header>
  );
}
