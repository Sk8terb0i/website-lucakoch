import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const dummyData = [
  { id: 1, title: "Oil Painting Exhibition", category: "artist" },
  { id: 2, title: "Guest Lecture at Uni Zurich", category: "educator" },
  { id: 3, title: "Article: The Future of Art", category: "journalist" },
  { id: 4, title: "Abstract Sculpture", category: "artist" },
];

// ==========================================
// 🛠️ RESPONSIVE LAYOUT SETTINGS
// ==========================================

// 1. The master container size: clamp(MIN, IDEAL, MAX)
const CONTAINER_SIZE = "clamp(350px, 45vmin, 700px)";

// 2. Triangle corners (Percentages of the container)
const CORNERS = {
  journalist: { x: "50%", y: "15%" },
  artist: { x: "15%", y: "80%" },
  educator: { x: "85%", y: "80%" },
};

// 3. Topic clusters (Pushed equally outward from the corners)
const TOPICS = {
  journalist: { left: "50%", top: "-5%" },
  artist: { left: "-5%", top: "95%" },
  educator: { left: "105%", top: "95%" },
};

export default function Portfolio({ category }) {
  const [activeCluster, setActiveCluster] = useState(null);

  // ==========================================
  // VIEW 1: THE DESKTOP LANDING (category === "all")
  // ==========================================
  if (category === "all") {
    // Uses angles from the center of the screen, with a central dead-zone!
    useEffect(() => {
      const handleMouseMove = (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // The Neutral Zone: If mouse is within 15vh of the center, do nothing.
        const deadZone = window.innerHeight * 0.15;

        if (dist < deadZone) {
          if (activeCluster !== null) setActiveCluster(null);
          return;
        }

        // Determine slice based on angle
        let newZone = null;
        if (angle > -150 && angle <= -30) newZone = "journalist";
        else if (angle > -30 && angle <= 90) newZone = "educator";
        else newZone = "artist";

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

    // 🌊 THE SOFT WAVE LOGIC (Now perfectly scales with the container)
    const getWaveStyle = (topic) => ({
      position: "absolute",
      left: CORNERS[topic].x,
      top: CORNERS[topic].y,
      width: "250%", // 250% of the container size ensures it covers everything
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
        {/* THE RESPONSIVE MASTER CONTAINER */}
        <div
          style={{
            position: "absolute",
            top: "48%", // Slightly above 50% to visually balance the bottom-heavy triangle
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: CONTAINER_SIZE,
            aspectRatio: "1 / 1", // Keeps it a perfect square
          }}
        >
          {/* THE TRIANGLE CLIPPING MASK */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              clipPath: `polygon(${CORNERS.journalist.x} ${CORNERS.journalist.y}, ${CORNERS.artist.x} ${CORNERS.artist.y}, ${CORNERS.educator.x} ${CORNERS.educator.y})`,
            }}
          >
            {/* Base Layer: The 3-Corner Gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `
                radial-gradient(circle at ${CORNERS.journalist.x} ${CORNERS.journalist.y}, var(--journalist) 0%, transparent 60%),
                radial-gradient(circle at ${CORNERS.artist.x} ${CORNERS.artist.y}, var(--artist) 0%, transparent 60%),
                radial-gradient(circle at ${CORNERS.educator.x} ${CORNERS.educator.y}, var(--educator) 0%, transparent 60%)
              `,
                backgroundColor: "var(--background)",
              }}
            />

            {/* The Soft Scaling Waves */}
            <div style={getWaveStyle("journalist")} />
            <div style={getWaveStyle("artist")} />
            <div style={getWaveStyle("educator")} />
          </div>

          {/* TOP CENTER: JOURNALIST */}
          <div style={clusterStyle("journalist")}>
            <h2 style={{ color: "var(--journalist)", margin: 0 }}>
              Journalist
            </h2>
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
