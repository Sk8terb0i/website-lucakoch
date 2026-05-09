import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const dummyData = [
  { id: 1, title: "Oil Painting Exhibition", category: "artist" },
  { id: 2, title: "Guest Lecture at Uni Zurich", category: "educator" },
  { id: 3, title: "Article: The Future of Art", category: "journalist" },
  { id: 4, title: "Abstract Sculpture", category: "artist" },
];

// ==========================================
// 🛠️ EASY LAYOUT SETTINGS
// ==========================================

const TOPIC_POSITIONS = {
  journalist: { left: "55%", top: "12%" },
  artist: { left: "15%", top: "55%" },
  educator: { left: "85%", top: "85%" },
};

const TRIANGLE_OFFSETS = {
  journalist: { x: "-50px", y: "50px" },
  artist: { x: "80px", y: "-10px" },
  educator: { x: "-80px", y: "-40px" },
};

// Split into X and Y so we can perfectly center our soft gradients
const getCornerX = (topic) =>
  `calc(${TOPIC_POSITIONS[topic].left} + ${TRIANGLE_OFFSETS[topic].x})`;
const getCornerY = (topic) =>
  `calc(${TOPIC_POSITIONS[topic].top} + ${TRIANGLE_OFFSETS[topic].y})`;
const getCorner = (topic) => `${getCornerX(topic)} ${getCornerY(topic)}`;

export default function Portfolio({ category }) {
  const [activeCluster, setActiveCluster] = useState(null);

  // ==========================================
  // VIEW 1: THE DESKTOP LANDING (category === "all")
  // ==========================================
  if (category === "all") {
    useEffect(() => {
      const handleMouseMove = (e) => {
        const distances = Object.keys(TOPIC_POSITIONS).map((topic) => {
          const elX =
            window.innerWidth * (parseFloat(TOPIC_POSITIONS[topic].left) / 100);
          const elY =
            window.innerHeight * (parseFloat(TOPIC_POSITIONS[topic].top) / 100);
          const dist = Math.hypot(e.clientX - elX, e.clientY - elY);
          return { topic, dist };
        });

        distances.sort((a, b) => a.dist - b.dist);
        const closest = distances[0];

        const triggerRadius =
          Math.min(window.innerWidth, window.innerHeight) * 0.35;

        if (closest.dist < triggerRadius) {
          if (activeCluster !== closest.topic) {
            setActiveCluster(closest.topic);
          }
        } else {
          if (activeCluster !== null) {
            setActiveCluster(null);
          }
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [activeCluster]);

    const getBlurStyle = (clusterName) => {
      if (!activeCluster || activeCluster === clusterName) return "none";
      return "blur(6px) opacity(0.5)";
    };

    const clusterStyle = (topic) => ({
      position: "absolute",
      left: TOPIC_POSITIONS[topic].left,
      top: TOPIC_POSITIONS[topic].top,
      transform: "translate(-50%, -50%)",
      transition: "filter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      zIndex: 10,
      filter: getBlurStyle(topic),
    });

    const getIconStyle = (topicColor) => ({
      backgroundColor: "var(--background)",
      border: `2px solid ${topicColor}`,
      borderRadius: "12px",
      padding: "1rem",
      fontSize: "2rem",
      cursor: "pointer",
      boxShadow: `4px 4px 0px ${topicColor}`,
      transition: "transform 0.2s, box-shadow 0.2s",
      textDecoration: "none",
      color: "var(--text)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
    });

    // 🌊 THE NEW SOFT WAVE LOGIC
    const getWaveStyle = (topic) => ({
      position: "absolute",
      // Anchor the exact center of this massive div to the triangle corner
      left: getCornerX(topic),
      top: getCornerY(topic),
      // Make it absolutely massive so it can cover any screen size
      width: "250vmax",
      height: "250vmax",
      // A soft radial gradient: Solid in the center, transparent at the edges
      background: `radial-gradient(circle closest-side, var(--${topic}) 40%, transparent 100%)`,
      // Scale from 0 to 1, centered on the corner
      transform: `translate(-50%, -50%) scale(${activeCluster === topic ? 1 : 0})`,
      // Buttery smooth easing for the wave
      transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)",
      zIndex: activeCluster === topic ? 2 : 1,
      pointerEvents: "none", // Ensures it doesn't block mouse clicks
    });

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundImage:
            "radial-gradient(var(--secondary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        {/* THE STATIC BACKGROUND TRIANGLE CONTAINER */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            clipPath: `polygon(${getCorner("journalist")}, ${getCorner("artist")}, ${getCorner("educator")})`,
          }}
        >
          {/* Base Layer: The 3-Corner Gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
              radial-gradient(circle at ${getCorner("journalist")}, var(--journalist) 0%, transparent 60%),
              radial-gradient(circle at ${getCorner("artist")}, var(--artist) 0%, transparent 60%),
              radial-gradient(circle at ${getCorner("educator")}, var(--educator) 0%, transparent 60%)
            `,
              backgroundColor: "var(--background)",
            }}
          />

          {/* The New Soft Scaling Waves */}
          <div style={getWaveStyle("journalist")} />
          <div style={getWaveStyle("artist")} />
          <div style={getWaveStyle("educator")} />
        </div>

        {/* TOP CENTER: JOURNALIST */}
        <div style={clusterStyle("journalist")}>
          <h2 style={{ color: "var(--journalist)", margin: 0 }}>Journalist</h2>
        </div>

        {/* BOTTOM LEFT: ARTIST */}
        <div style={clusterStyle("artist")}>
          <h2 style={{ color: "var(--artist)", margin: 0 }}>Artist</h2>
        </div>

        {/* BOTTOM RIGHT: EDUCATOR */}
        <div style={clusterStyle("educator")}>
          <h2 style={{ color: "var(--educator)", margin: 0 }}>Educator</h2>
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
          }}
        >
          Luca Koch
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
            ← Back to Desktop
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
            Artist
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
            Educator
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
            Journalist
          </Link>
        </nav>
      </header>

      <main>
        <h2
          style={{
            borderBottom: `3px solid ${activeColor}`,
            paddingBottom: "0.5rem",
            color: activeColor,
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
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
                  textTransform: "uppercase",
                }}
              >
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
