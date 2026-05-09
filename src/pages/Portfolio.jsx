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

const CONTAINER_SIZE = "clamp(150px, 45vmin, 700px)";
const CORNERS = {
  artist: { x: "50%", y: "15%" },
  journalist: { x: "15%", y: "80%" },
  educator: { x: "85%", y: "80%" },
};
// 🛠️ DESKTOP OFFSETS
const DESKTOP_TOPICS = {
  artist: { left: "50%", top: "-5%" },
  journalist: { left: "-5%", top: "95%" },
  educator: { left: "105%", top: "95%" },
};

// 🛠️ MOBILE OFFSETS (Pushed further out)
const MOBILE_TOPICS = {
  artist: { left: "50%", top: "-15%" },
  journalist: { left: "-15%", top: "110%" },
  educator: { left: "115%", top: "110%" },
};

export default function Portfolio({ category }) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [activeCluster, setActiveCluster] = useState(null);

  // Mobile detection state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listener to update mobile state on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. ALL HOOKS MUST BE AT THE TOP LEVEL
  useEffect(() => {
    // Only run mouse logic if we are on the 'all' view AND it is not mobile
    if (category !== "all" || isMobile) return;

    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const minRadius = window.innerHeight * 0.15;
      const maxRadius = window.innerHeight * 0.4;

      if (dist < minRadius || dist > maxRadius) {
        if (activeCluster !== null) setActiveCluster(null);
        return;
      }

      let newZone = null;
      if (angle > -150 && angle <= -30) newZone = "artist";
      else if (angle > -30 && angle <= 90) newZone = "educator";
      else newZone = "journalist";

      if (newZone !== activeCluster) setActiveCluster(newZone);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeCluster, category, isMobile]);

  // 2. FAVICON LOGIC
  useEffect(() => {
    if (window.updateFavicon) {
      const state = category === "all" ? activeCluster || "all" : category;
      window.updateFavicon(state);
    }
  }, [category, activeCluster]);

  // 3. RESET STATE ON NAVIGATION
  useEffect(() => {
    setActiveCluster(null);
  }, [category]);

  // ==========================================
  // RENDER LOGIC
  // ==========================================

  if (category === "all") {
    // ADJUST FONT SIZES HERE
    const MOBILE_FONT_SIZE = "1.2rem";
    const DESKTOP_FONT_SIZE = "2rem";
    const currentFontSize = isMobile ? MOBILE_FONT_SIZE : DESKTOP_FONT_SIZE;

    // OFFSETS SWITCHER
    const currentTopics = isMobile ? MOBILE_TOPICS : DESKTOP_TOPICS;

    const getBlurStyle = (clusterName) => {
      if (!activeCluster || activeCluster === clusterName) return "none";
      return "blur(2px) opacity(0.5)";
    };

    const clusterStyle = (topic) => ({
      position: "absolute",
      left: currentTopics[topic].left,
      top: currentTopics[topic].top,
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

    // Mobile Tap Handlers
    const handleTitleTap = (topic, e) => {
      if (!isMobile) return;
      e.stopPropagation(); // Stops the tap from reaching the background reset
      setActiveCluster(topic);
    };

    const handleBackgroundTap = () => {
      if (!isMobile) return;
      setActiveCluster(null);
    };

    return (
      <div
        onClick={handleBackgroundTap} // ADDED: Reset on background tap anywhere
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
                background: `radial-gradient(circle at ${CORNERS.artist.x} ${CORNERS.artist.y}, var(--artist) 0%, transparent 60%), radial-gradient(circle at ${CORNERS.journalist.x} ${CORNERS.journalist.y}, var(--journalist) 0%, transparent 60%), radial-gradient(circle at ${CORNERS.educator.x} ${CORNERS.educator.y}, var(--educator) 0%, transparent 60%)`,
                backgroundColor: "var(--background)",
              }}
            />
            <div style={getWaveStyle("artist")} />
            <div style={getWaveStyle("journalist")} />
            <div style={getWaveStyle("educator")} />
          </div>

          <div
            style={clusterStyle("artist")}
            onClick={(e) => handleTitleTap("artist", e)}
          >
            <h2
              style={{
                color: "var(--artist)",
                fontFamily: "BrandFont, sans-serif",
                textTransform: "lowercase",
                fontSize: currentFontSize, // MODIFIED: Uses the variable defined above
                margin: 0,
              }}
            >
              {t.artist}
            </h2>
          </div>
          <div
            style={clusterStyle("journalist")}
            onClick={(e) => handleTitleTap("journalist", e)}
          >
            <h2
              style={{
                color: "var(--journalist)",
                fontFamily: "BrandFont, sans-serif",
                textTransform: "lowercase",
                fontSize: currentFontSize, // MODIFIED: Uses the variable defined above
                margin: 0,
              }}
            >
              {t.journalist}
            </h2>
          </div>
          <div
            style={clusterStyle("educator")}
            onClick={(e) => handleTitleTap("educator", e)}
          >
            <h2
              style={{
                color: "var(--educator)",
                fontFamily: "BrandFont, sans-serif",
                textTransform: "lowercase",
                fontSize: currentFontSize, // MODIFIED: Uses the variable defined above
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

  // FILTERED VIEW
  const getTopicColor = (cat) => `var(--${cat})`;
  const filteredItems = dummyData.filter((item) => item.category === category);
  const activeColor = getTopicColor(category);

  return (
    <div style={{ maxWidth: "800px", margin: "10vh auto", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            color: "var(--text)",
            textTransform: "lowercase",
            fontFamily: "BrandFont, sans-serif",
          }}
        >
          {t.siteTitle}
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
              fontSize: "0.85rem",
              fontFamily: "Satoshi, sans-serif",
            }}
          >
            {t.backToDesktop}
          </Link>
          {/* Nav links... */}
        </nav>
      </header>
      <main>
        <h2
          style={{
            borderBottom: `3px solid ${activeColor}`,
            paddingBottom: "0.5rem",
            color: activeColor,
            textTransform: "lowercase",
            fontFamily: "BrandFont, sans-serif",
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
              }}
            >
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "var(--text)",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                {item.title}
              </h3>
              <span
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  textTransform: "lowercase",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                {t[item.category]}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
