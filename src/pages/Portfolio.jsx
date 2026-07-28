import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

const CONTAINER_SIZE = "clamp(150px, 45vmin, 700px)";
const CORNERS = {
  artist: { x: "50%", y: "15%" },
  journalist: { x: "15%", y: "80%" },
  educator: { x: "85%", y: "80%" },
};

// DESKTOP OFFSETS
const DESKTOP_TOPICS = {
  artist: { left: "50%", top: "-5%" },
  journalist: { left: "-5%", top: "95%" },
  educator: { left: "105%", top: "95%" },
};

// MOBILE OFFSETS
const MOBILE_TOPICS = {
  artist: { left: "50%", top: "-15%" },
  journalist: { left: "-15%", top: "110%" },
  educator: { left: "115%", top: "110%" },
};

export default function Portfolio() {
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

  // 1. Mouse movement hover zone detection (Desktop only)
  useEffect(() => {
    if (isMobile) return;

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
  }, [activeCluster, isMobile]);

  // 2. Favicon logic
  useEffect(() => {
    if (window.updateFavicon) {
      window.updateFavicon(activeCluster || "all");
    }
  }, [activeCluster]);

  const MOBILE_FONT_SIZE = "1.2rem";
  const DESKTOP_FONT_SIZE = "2rem";
  const currentFontSize = isMobile ? MOBILE_FONT_SIZE : DESKTOP_FONT_SIZE;
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

  const handleTitleTap = (topic, e) => {
    if (!isMobile) return;
    e.stopPropagation();
    setActiveCluster(topic);
  };

  const handleBackgroundTap = () => {
    if (!isMobile) return;
    setActiveCluster(null);
  };

  return (
    <div
      onClick={handleBackgroundTap}
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
              fontSize: currentFontSize,
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
              fontSize: currentFontSize,
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
              fontSize: currentFontSize,
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
