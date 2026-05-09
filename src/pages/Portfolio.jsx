import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

const dummyData = [
  { id: 1, title: "Oil Painting Exhibition", category: "artist" },
  { id: 2, title: "Guest Lecture at Uni Zurich", category: "educator" },
  { id: 3, title: "Article: The Future of Art", category: "journalist" },
  { id: 4, title: "Abstract Sculpture", category: "artist" },
];

// ==========================================
// 🛠️ RESPONSIVE LAYOUT SETTINGS
// ==========================================

const CONTAINER_SIZE = "clamp(350px, 45vmin, 700px)";

// 1. Triangle corners (Percentages of the container)
const CORNERS = {
  artist: { x: "50%", y: "15%" }, // Now at Top
  journalist: { x: "15%", y: "80%" }, // Now at Bottom Left
  educator: { x: "85%", y: "80%" }, // Bottom Right
};

// 2. Topic clusters (Pushed equally outward from the corners)
const TOPICS = {
  artist: { left: "50%", top: "-5%" }, // Now at Top
  journalist: { left: "-5%", top: "95%" }, // Now at Bottom Left
  educator: { left: "105%", top: "95%" }, // Bottom Right
};

export default function Portfolio({ category }) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [activeCluster, setActiveCluster] = useState(null);

  // ==========================================
  // VIEW 1: THE DESKTOP LANDING (category === "all")
  // ==========================================
  if (category === "all") {
    useEffect(() => {
      const handleMouseMove = (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // 🛠️ THE LIMITS
        // minRadius: mouse must be at least this far from center to trigger
        // maxRadius: mouse must be within this distance to trigger
        const minRadius = window.innerHeight * 0.15;
        const maxRadius = window.innerHeight * 0.4; // Adjust this to define the "outer edge"

        // If mouse is too close to center OR too far away, reset to neutral
        if (dist < minRadius || dist > maxRadius) {
          if (activeCluster !== null) setActiveCluster(null);
          return;
        }

        // Determine slice based on angle (only happens if within the distance range)
        let newZone = null;
        if (angle > -150 && angle <= -30) newZone = "artist";
        else if (angle > -30 && angle <= 90) newZone = "educator";
        else newZone = "journalist";

        if (newZone !== activeCluster) {
          setActiveCluster(newZone);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [activeCluster]);

    const getBlurStyle = (clusterName) => {
      if (!activeCluster || activeCluster === clusterName) return "none";
      return "blur(2px) opacity(0.5)";
    };

    const clusterStyle = (topic) => ({
      position: "absolute",
      left: TOPICS[topic].left,
      top: TOPICS[topic].top,
      transform: "translate(-50%, -50%)",
      transition: "filter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      zIndex: 10,
      filter: getBlurStyle(topic),
    });

    const getWaveStyle = (topic) => ({
      position: "absolute",
      left: CORNERS[topic].x,
      top: CORNERS[topic].y,
      width: "250%",
      height: "250%",
      background: `radial-gradient(circle closest-side, var(--${topic}) 10%, transparent 80%)`,
      transform: `translate(-50%, -50%) scale(${activeCluster === topic ? 1 : 0.1})`,
      opacity: activeCluster === topic ? 1 : 0,
      transition:
        "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-in-out",
      zIndex: activeCluster === topic ? 2 : 1,
      pointerEvents: "none",
    });

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: CONTAINER_SIZE,
            aspectRatio: "1 / 1",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              clipPath: `polygon(${CORNERS.artist.x} ${CORNERS.artist.y}, ${CORNERS.journalist.x} ${CORNERS.journalist.y}, ${CORNERS.educator.x} ${CORNERS.educator.y})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `
                radial-gradient(circle at ${CORNERS.artist.x} ${CORNERS.artist.y}, var(--artist) 0%, transparent 60%),
                radial-gradient(circle at ${CORNERS.journalist.x} ${CORNERS.journalist.y}, var(--journalist) 0%, transparent 60%),
                radial-gradient(circle at ${CORNERS.educator.x} ${CORNERS.educator.y}, var(--educator) 0%, transparent 60%)
              `,
                backgroundColor: "var(--background)",
              }}
            />

            <div style={getWaveStyle("artist")} />
            <div style={getWaveStyle("journalist")} />
            <div style={getWaveStyle("educator")} />
          </div>

          {/* TOP CENTER: ARTIST */}
          <div style={clusterStyle("artist")}>
            <h2
              style={{
                color: "var(--artist)",
                fontFamily: "BrandFont, sans-serif",
                textTransform: "lowercase",
                fontSize: "2rem",
                margin: 0,
              }}
            >
              {t.artist}
            </h2>
          </div>

          {/* BOTTOM LEFT: JOURNALIST */}
          <div style={clusterStyle("journalist")}>
            <h2
              style={{
                color: "var(--journalist)",
                fontFamily: "BrandFont, sans-serif",
                textTransform: "lowercase",
                fontSize: "2rem",
                margin: 0,
              }}
            >
              {t.journalist}
            </h2>
          </div>

          {/* BOTTOM RIGHT: EDUCATOR */}
          <div style={clusterStyle("educator")}>
            <h2
              style={{
                color: "var(--educator)",
                fontFamily: "BrandFont, sans-serif",
                textTransform: "lowercase",
                fontSize: "2rem",
                margin: 0,
              }}
            >
              {t.educator}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE FILTERED LIST (Inner Pages)
  // ==========================================
  const getTopicColor = (cat) => `var(--${cat})`;
  const filteredItems = dummyData.filter((item) => item.category === category);
  const activeColor = getTopicColor(category);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            color: "var(--text)",
            textTransform: "lowercase", // matching your aesthetic
          }}
        >
          {t.siteTitle} {/* TRANSLATED SITE TITLE */}
        </h1>
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "var(--secondary)",
              color: "var(--text)",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {t.backToDesktop}
          </Link>
          <Link
            to="/artist"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor:
                category === "artist" ? "var(--artist)" : "var(--secondary)",
              color:
                category === "artist" ? "var(--background)" : "var(--text)",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {t.artist}
          </Link>
          <Link
            to="/educator"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor:
                category === "educator"
                  ? "var(--educator)"
                  : "var(--secondary)",
              color:
                category === "educator" ? "var(--background)" : "var(--text)",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {t.educator}
          </Link>
          <Link
            to="/journalist"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor:
                category === "journalist"
                  ? "var(--journalist)"
                  : "var(--secondary)",
              color:
                category === "journalist" ? "var(--background)" : "var(--text)",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {t.journalist}
          </Link>
        </nav>
      </header>

      <main>
        <h2
          style={{
            borderBottom: `3px solid ${activeColor}`,
            paddingBottom: "0.5rem",
            color: activeColor,
            textTransform: "lowercase",
          }}
        >
          {t[category]}
        </h2>

        <div style={{ display: "grid", gap: "1.5rem", marginTop: "2rem" }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "var(--accent)",
                border: "1px solid var(--secondary)",
                borderLeft: `8px solid ${getTopicColor(item.category)}`,
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--text)" }}>
                {item.title}
              </h3>
              <span
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  textTransform: "lowercase",
                }}
              >
                {t[item.category]} {/* TRANSLATED CATEGORY TAG */}
              </span>
            </div>
          ))}

          {/* ADDED TRANSLATED EMPTY STATE */}
          {filteredItems.length === 0 && (
            <p
              style={{
                color: "var(--text)",
                opacity: 0.7,
                textAlign: "center",
                marginTop: "2rem",
              }}
            >
              {t.noItems}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
