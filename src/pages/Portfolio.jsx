import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

const CONTAINER_SIZE = "clamp(220px, 45vmin, 600px)";

const CORNERS = {
  artist: { x: "50%", y: "15%" },
  journalist: { x: "15%", y: "80%" },
  educator: { x: "85%", y: "80%" },
};

// Anchors
const DESKTOP_TOPICS = {
  artist: { left: "50%", top: "-5%" },
  journalist: { left: "-5%", top: "95%" },
  educator: { left: "105%", top: "95%" },
};

const MOBILE_TOPICS = {
  artist: { left: "50%", top: "-10%" },
  journalist: { left: "12%", top: "105%" },
  educator: { left: "88%", top: "105%" },
};

export default function Portfolio() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [activeCluster, setActiveCluster] = useState(null);
  const [isTriangleHovered, setIsTriangleHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop Mouse Zone Hover Detection
  useEffect(() => {
    if (isMobile || activeCluster === "all") return;

    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const minRadius = window.innerHeight * 0.15;
      const maxRadius = window.innerHeight * 0.42;

      if (dist < minRadius || dist > maxRadius) {
        if (activeCluster !== null && activeCluster !== "all") {
          setActiveCluster(null);
        }
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

  useEffect(() => {
    if (window.updateFavicon) {
      window.updateFavicon(activeCluster || "all");
    }
  }, [activeCluster]);

  const handleTriangleClick = (e) => {
    e.stopPropagation();
    setActiveCluster((prev) => (prev === "all" ? null : "all"));
  };

  const handleTopicClick = (topic, e) => {
    e.stopPropagation();
    setActiveCluster((prev) => (prev === topic ? null : topic));
  };

  const currentTopics = isMobile ? MOBILE_TOPICS : DESKTOP_TOPICS;
  const isVisible = (topic) =>
    activeCluster === "all" || activeCluster === topic;

  const getBlurStyle = (clusterName) => {
    if (
      !activeCluster ||
      activeCluster === "all" ||
      activeCluster === clusterName
    ) {
      return "none";
    }
    return "blur(2px) opacity(0.5)";
  };

  // RECALIBRATED EXPANSION WAVE LOGIC
  const getWaveStyle = (topic) => {
    const isSingleActive = activeCluster === topic;
    const isAllActive = activeCluster === "all";

    return {
      position: "absolute",
      left: CORNERS[topic].x,
      top: CORNERS[topic].y,
      width: "250%",
      height: "250%",
      background: `radial-gradient(circle closest-side, var(--${topic}) 12%, transparent 75%)`,
      /* Scale 1.1 for single topic focus, 0.68 when ALL active to meet vividly in the middle */
      transform: `translate(-50%, -50%) scale(${
        isSingleActive ? 1.1 : isAllActive ? 0.68 : 0.1
      })`,
      opacity: isSingleActive ? 0.9 : isAllActive ? 0.72 : 0,
      transition:
        "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-in-out",
      zIndex: isSingleActive ? 3 : 2,
      pointerEvents: "none",
    };
  };

  const clusterData = {
    artist: [
      {
        title: "SenSing",
        path: "/art/sensing",
        x: isMobile ? 0 : 0,
        y: isMobile ? -38 : -55,
      },
      {
        title: "Pistache",
        path: "/art/pistache",
        x: isMobile ? -75 : -120,
        y: isMobile ? -20 : -30,
      },
      {
        title: "Brassmaster Flash",
        path: "/art/brassmaster-flash",
        x: isMobile ? 75 : 120,
        y: isMobile ? -20 : -30,
      },
      {
        title: "High D",
        path: "/art/high-d",
        x: isMobile ? -85 : -140,
        y: isMobile ? 5 : 15,
      },
      {
        title: "Worldbuzzpoems",
        path: "/art/worldbuzzpoems",
        x: isMobile ? 85 : 140,
        y: isMobile ? 5 : 15,
      },
    ],
    journalist: [
      {
        title: "Audio",
        path: "/journalism/audio",
        x: isMobile ? -25 : -110,
        y: isMobile ? 28 : -40,
      },
      {
        title: t.articles,
        path: "/journalism/artikel",
        x: isMobile ? 35 : 90,
        y: isMobile ? 28 : -40,
      },
      {
        title: "TV",
        path: "/journalism/tv",
        x: isMobile ? 5 : 0,
        y: isMobile ? 52 : 45,
      },
    ],
    educator: [
      {
        title: "Atelier Sinnesküche",
        path: "/education/atelier-sinneskueche",
        x: isMobile ? -45 : -120,
        y: isMobile ? 28 : -45,
      },
      {
        title: "WIAM",
        path: "/education/wiam",
        x: isMobile ? 45 : 100,
        y: isMobile ? 28 : -45,
      },
      {
        title: "Gesangsküche",
        path: "/education/gesangskueche",
        x: isMobile ? -45 : -130,
        y: isMobile ? 52 : 40,
      },
      {
        title: t.choirProjects,
        path: "/education/chorprojekte",
        x: isMobile ? 45 : 110,
        y: isMobile ? 52 : 40,
      },
      {
        title: "Jugendjazzorchester.ch",
        url: "https://jugendjazzorchester.ch",
        isExternal: true,
        x: isMobile ? 0 : -80,
        y: isMobile ? 76 : 85,
      },
      {
        title: t.moodsCouncil,
        url: "https://www.moods.ch/das-moods/ueber-uns/team/musiker-innenrat",
        isExternal: true,
        x: isMobile ? 0 : -10,
        y: isMobile ? 102 : 118,
      },
    ],
  };

  return (
    <div
      onClick={() => setActiveCluster(null)}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--background)",
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
        {/* INTERACTIVE GRADIENT TRIANGLE */}
        <div
          onClick={handleTriangleClick}
          onMouseEnter={() => setIsTriangleHovered(true)}
          onMouseLeave={() => setIsTriangleHovered(false)}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            cursor: "pointer",
            clipPath: `polygon(${CORNERS.artist.x} ${CORNERS.artist.y}, ${CORNERS.journalist.x} ${CORNERS.journalist.y}, ${CORNERS.educator.x} ${CORNERS.educator.y})`,
            transform: isTriangleHovered ? "scale(1.03)" : "scale(1)",
            filter: isTriangleHovered
              ? "brightness(1.08) drop-shadow(0 0 15px rgba(0,0,0,0.12))"
              : "none",
            transition:
              "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease",
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

        {/* TOPICS & WORD CLUSTER LINKS */}
        {["artist", "journalist", "educator"].map((topic) => {
          const active = isVisible(topic);
          const links = clusterData[topic];

          return (
            <div
              key={topic}
              style={{
                position: "absolute",
                left: currentTopics[topic].left,
                top: currentTopics[topic].top,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                filter: getBlurStyle(topic),
                transition: "filter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              {/* MAIN TOPIC HEADING + ABSOLUTE NAV ARROW */}
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2
                  onClick={(e) => handleTopicClick(topic, e)}
                  style={{
                    color: `var(--${topic})`,
                    fontFamily: "BrandFont, sans-serif",
                    textTransform: "lowercase",
                    fontSize: isMobile ? "1.3rem" : "2.2rem",
                    margin: 0,
                    cursor: "pointer",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.04)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {t[topic]}
                </h2>

                <Link
                  to={
                    topic === "artist"
                      ? "/art"
                      : topic === "educator"
                        ? "/education"
                        : "/journalism"
                  }
                  onClick={(e) => e.stopPropagation()}
                  title={`Go to ${t[topic]} page`}
                  style={{
                    position: "absolute",
                    left: "calc(100% + 4px)",
                    top: "50%",
                    textDecoration: "none",
                    color: `var(--${topic})`,
                    fontFamily: "BrandFont, sans-serif",
                    fontSize: isMobile ? "1.1rem" : "1.6rem",
                    lineHeight: 1,
                    opacity: active ? 1 : 0,
                    pointerEvents: active ? "auto" : "none",
                    transform: active
                      ? "translateY(-50%) translateX(0)"
                      : "translateY(-50%) translateX(-6px)",
                    transition: "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                    whiteSpace: "nowrap",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform =
                      "translateY(-50%) translateX(4px)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform =
                      "translateY(-50%) translateX(0)")
                  }
                >
                  →
                </Link>
              </div>

              {/* FLOATING WORD CLUSTER WITH MARKER HIGHLIGHT */}
              {links.map((link) => {
                const linkStyle = {
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: active
                    ? `translate(calc(-50% + ${link.x}px), calc(-50% + ${link.y}px)) scale(1)`
                    : "translate(-50%, -50%) scale(0.6)",
                  opacity: active ? 1 : 0,
                  pointerEvents: active ? "auto" : "none",
                  transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  whiteSpace: "nowrap",
                  textDecoration: link.isExternal
                    ? "underline dashed rgba(20,28,9,0.3)"
                    : "none",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: isMobile ? "0.72rem" : "0.88rem",
                  fontWeight: link.isExternal ? "400" : "500",
                  fontStyle: link.isExternal ? "italic" : "normal",
                  color: "var(--text)",
                  backgroundColor: `color-mix(in srgb, var(--${topic}) 22%, transparent)`,
                  borderRadius: "2px 4px 2px 3px",
                  padding: "0.12rem 0.45rem",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                };

                return link.isExternal ? (
                  <a
                    key={link.title}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={linkStyle}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--${topic}) 38%, transparent)`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--${topic}) 22%, transparent)`;
                    }}
                  >
                    {link.title}{" "}
                    <span style={{ fontSize: "0.75em", opacity: 0.7 }}>↗</span>
                  </a>
                ) : (
                  <Link
                    key={link.title}
                    to={link.path}
                    onClick={(e) => e.stopPropagation()}
                    style={linkStyle}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--${topic}) 38%, transparent)`;
                      e.currentTarget.style.color = `var(--${topic})`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--${topic}) 22%, transparent)`;
                      e.currentTarget.style.color = "var(--text)";
                    }}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
