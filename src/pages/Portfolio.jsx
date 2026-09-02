import { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

const CONTAINER_SIZE = "clamp(220px, 45vmin, 600px)";

// ----------------------------------------------------------------------
// 🎛️ EASY BACKGROUND IMAGE CONFIGURATION
// ----------------------------------------------------------------------
const BACKGROUND_IMAGE = "/LUCAKOCH_4480x6720_NicolePfister_9093_MASTER.jpg";

// Adjust the desktop percentage to move the crop up or down (e.g., "center top", "center 20%")
const BACKGROUND_POSITION = {
  desktop: "center 20%",
  mobile: "center center",
};

const CORNERS = {
  artist: { x: "50%", y: "15%" },
  journalist: { x: "15%", y: "80%" },
  educator: { x: "85%", y: "80%" },
};

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

// Generous Character width algorithm to guarantee perfect marker highlights
const getApproxWidth = (str, isMobile) => {
  const size = isMobile ? 11.5 : 13.5;
  let width = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (/[A-Z]/.test(char)) width += 0.72;
    else if (/[wmy]/i.test(char)) width += 0.75;
    else if (/[iljftr1 \.,']/i.test(char)) width += 0.32;
    else width += 0.54;
  }
  return width * size;
};

// SVG Component to render curved text with a FLAWLESS crisp marker stroke
const CurvedLink = ({
  link,
  topic,
  active,
  isMobile,
  navigate,
  isZoomedIn,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (link.isExternal) {
      window.open(link.url, "_blank");
    } else {
      navigate(link.path);
    }
  };

  const pathId = `curve-${link.ring}-${topic}-${link.r}`;
  const scale = active ? 1 : 0.6;
  const opacity = active ? 1 : 0;

  const C = 2 * Math.PI * link.r;
  const titleText = link.title + (link.isExternal ? "  " : "");
  const calcWidth = getApproxWidth(titleText, isMobile);
  const padding = isMobile ? 22 : 28;
  const textLen = calcWidth + padding;

  const offsetRatio = parseInt(link.offset, 10) / 100;
  const centerPx = offsetRatio * C;
  const startPx = Math.max(0, centerPx - textLen / 2);

  return (
    <g
      style={{
        opacity: opacity,
        pointerEvents: active ? "auto" : "none",
        transition:
          "opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
        transform: `scale(${scale})`,
        transformOrigin: "250px 250px",
        cursor: "pointer",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <use
        href={`#${pathId}`}
        stroke={`var(--${topic})`}
        strokeWidth={isMobile ? "18" : "22"}
        strokeOpacity={isHovered ? 0.7 : 0.5}
        strokeLinecap="butt"
        strokeDasharray={
          isMobile
            ? `0 ${startPx} ${textLen} ${C * 2}`
            : `0 ${startPx - 10} ${textLen + 20} ${C * 2}`
        }
        fill="none"
        style={{ transition: "stroke-opacity 0.2s ease" }}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: "'BrandFont', sans-serif",
          fontSize: isMobile ? "16px" : "22px",
          fontWeight: link.isExternal ? "400" : "500",
          fontStyle: link.isExternal ? "italic" : "normal",
          fill: isHovered
            ? `var(--${topic})`
            : isZoomedIn
              ? "var(--text)"
              : "var(--background)",
          transition: "fill 0.4s ease",
        }}
      >
        <textPath href={`#${pathId}`} startOffset={link.offset}>
          {link.title}
          {link.isExternal ? " ↗" : ""}
        </textPath>
      </text>
    </g>
  );
};

export default function Portfolio() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();
  const [activeCluster, setActiveCluster] = useState(null);
  const [isTriangleHovered, setIsTriangleHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // High-performance trigger for the liquid distortion on zoom
  const [zoomReactionKey, setZoomReactionKey] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isZoomedIn = activeCluster !== null && activeCluster !== "all";

  // Trigger Header/Footer color change
  useEffect(() => {
    const event = new CustomEvent("zoomStateChange", { detail: isZoomedIn });
    window.dispatchEvent(event);
  }, [isZoomedIn]);

  // Triggers the pure SVG distortion spike when zooming
  useEffect(() => {
    setZoomReactionKey(Date.now());
  }, [activeCluster]);

  // ----------------------------------------------------------------------
  // ⚙️ EASY LAYOUT CONFIGURATION
  // ----------------------------------------------------------------------

  const getRadiuses = (topic) => {
    if (topic === "artist") return isMobile ? [55, 110] : [75, 135];
    if (topic === "journalist") return isMobile ? [65, 100] : [98, 155];
    if (topic === "educator") return isMobile ? [60, 95] : [115, 165];
    return [85, 130];
  };

  const clusterData = {
    artist: [
      {
        title: "SenSing",
        path: "/art/sensing",
        level: 1,
        ring: "top",
        offset: "53%",
      },
      {
        title: "Pistache",
        path: "/art/pistache",
        level: 1,
        ring: "bottom",
        offset: "28%",
      },
      {
        title: "High D",
        path: "/art/high-d",
        level: 1,
        ring: "bottom",
        offset: "58%",
      },
      {
        title: "Brassmaster Flash",
        path: "/art/brassmaster-flash",
        level: 2,
        ring: "top",
        offset: "40%",
      },
      {
        title: "Worldbuzzpoems",
        path: "/art/worldbuzzpoems",
        level: 2,
        ring: "bottom",
        offset: "65%",
      },
    ],
    journalist: [
      {
        title: "Audio",
        path: "/journalism/audio",
        level: 1,
        ring: "bottom",
        offset: "47%",
      },
      {
        title: t.articles,
        path: "/journalism/artikel",
        level: 1,
        ring: "top",
        offset: "41%",
      },
      {
        title: "TV",
        path: "/journalism/tv",
        level: 2,
        ring: "bottom",
        offset: "55%",
      },
    ],
    educator: [
      {
        title: "WIAM",
        path: "/education/wiam",
        level: 1,
        ring: "top",
        offset: "40%",
      },
      {
        title: "Gesangsküche",
        path: "/education/gesangskueche",
        level: 1,
        ring: "bottom",
        offset: "36%",
      },
      {
        title: t.choirProjects,
        path: "/education/chorprojekte",
        level: 1,
        ring: "bottom",
        offset: "72%",
      },
      {
        title: "Atelier Sinnesküche",
        path: "/education/atelier-sinneskueche",
        level: 2,
        ring: "top",
        offset: "57%",
      },
      {
        title: "Jugendjazzorchester.ch",
        url: "https://jugendjazzorchester.ch",
        isExternal: true,
        level: 2,
        ring: "bottom",
        offset: "29%",
      },
      {
        title: t.moodsCouncil,
        url: "https://www.moods.ch/das-moods/ueber-uns/team/musiker-innenrat",
        isExternal: true,
        level: 2,
        ring: "bottom",
        offset: "65%",
      },
    ],
  };

  const currentTopics = isMobile ? MOBILE_TOPICS : DESKTOP_TOPICS;

  // ----------------------------------------------------------------------
  // MATHEMATICAL ZOOM, PAN, & HOVER ENGINE
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (isMobile || activeCluster === "all") return;

    const handleMouseMove = (e) => {
      // GUARD: Stop calculating hover distances if the mobile menu is open
      if (document.body.style.overflow === "hidden") return;

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const containerPx = Math.max(220, Math.min(vmin * 0.45, 600));

      if (activeCluster !== null) {
        const S = 1.5;
        const outerR = getRadiuses(activeCluster)[1];
        const outerRadiusPhysical = outerR * S;

        const cornerPctX = parseFloat(CORNERS[activeCluster].x);
        const cornerPctY = parseFloat(CORNERS[activeCluster].y);
        const topicPctX = parseFloat(currentTopics[activeCluster].left);
        const topicPctY = parseFloat(currentTopics[activeCluster].top);

        const svgOffsetX_pct = topicPctX - cornerPctX;
        const svgOffsetY_pct = topicPctY - cornerPctY;
        const svgScreenX = cx + (svgOffsetX_pct / 100) * (containerPx * S);
        const svgScreenY = cy + (svgOffsetY_pct / 100) * (containerPx * S);

        const distFromSvg = Math.hypot(
          e.clientX - svgScreenX,
          e.clientY - svgScreenY,
        );

        if (distFromSvg > outerRadiusPhysical + 40) {
          setActiveCluster(null);
        }
        return;
      }

      const getTopicCoord = (topicKey) => {
        const pctX = parseFloat(currentTopics[topicKey].left);
        const pctY = parseFloat(currentTopics[topicKey].top);
        return {
          x: cx + ((pctX - 50) / 100) * containerPx,
          y: cy + ((pctY - 50) / 100) * containerPx,
        };
      };

      const dArtist = Math.hypot(
        e.clientX - getTopicCoord("artist").x,
        e.clientY - getTopicCoord("artist").y,
      );
      const dJourn = Math.hypot(
        e.clientX - getTopicCoord("journalist").x,
        e.clientY - getTopicCoord("journalist").y,
      );
      const dEdu = Math.hypot(
        e.clientX - getTopicCoord("educator").x,
        e.clientY - getTopicCoord("educator").y,
      );

      const TRIGGER_DIST = containerPx * 0.3;

      if (dArtist < TRIGGER_DIST) setActiveCluster("artist");
      else if (dJourn < TRIGGER_DIST) setActiveCluster("journalist");
      else if (dEdu < TRIGGER_DIST) setActiveCluster("educator");
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeCluster, isMobile, currentTopics]);

  useEffect(() => {
    if (window.updateFavicon) window.updateFavicon(activeCluster || "all");
  }, [activeCluster]);

  const handleTriangleClick = (e) => {
    e.stopPropagation();
    setActiveCluster((prev) => (prev === "all" ? null : "all"));
  };

  const handleTopicClick = (topic, e) => {
    e.stopPropagation();
    if (activeCluster === topic) {
      navigate(
        topic === "artist"
          ? "/art"
          : topic === "educator"
            ? "/education"
            : "/journalism",
      );
    } else {
      setActiveCluster(topic);
    }
  };

  const isVisible = (topic) =>
    activeCluster === "all" || activeCluster === topic;

  const getBlurStyle = (clusterName) => {
    if (
      !activeCluster ||
      activeCluster === "all" ||
      activeCluster === clusterName
    )
      return "none";
    return "blur(2px) opacity(0.5)";
  };

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

  const getContainerTransform = () => {
    if (!activeCluster || activeCluster === "all") {
      return "translate(-50%, -50%) scale(1)";
    }

    const S = isMobile ? 1.25 : 1.5;
    let cx = parseFloat(CORNERS[activeCluster].x);
    let cy = parseFloat(CORNERS[activeCluster].y);

    if (isMobile) {
      cx = parseFloat(MOBILE_TOPICS[activeCluster].left);
      cy = parseFloat(MOBILE_TOPICS[activeCluster].top);
    }

    const tx = (50 - cx) * S;
    const ty = (50 - cy) * S;

    return `translate(calc(-50% + ${tx}%), calc(-50% + ${ty}%)) scale(${S})`;
  };

  // --- MOBILE SHIFT ENGINE ---
  let shiftX = 0;
  let shiftY = 0;

  if (isMobile && activeCluster) {
    if (activeCluster === "artist") {
      shiftX = 0;
      shiftY = 15;
    } else if (activeCluster === "journalist") {
      shiftX = 22;
      shiftY = 10;
    } else if (activeCluster === "educator") {
      shiftX = -22;
      shiftY = -2;
    }
  }

  const triangleTransform = isTriangleHovered
    ? `translate(${shiftX}%, ${shiftY}%) scale(1.03)`
    : `translate(${shiftX}%, ${shiftY}%) scale(1)`;

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
      {/* 💧 FLUID ORGANIC SVG FILTER WITH ZOOM SPIKE */}
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="liquid-surface"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.02"
              numOctaves="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.012 0.02; 0.02 0.012; 0.012 0.02"
                dur="8s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="B"
            >
              {/* This effortlessly spikes the distortion during the 0.8s transition window without shifting the element */}
              <animate
                key={zoomReactionKey}
                attributeName="scale"
                values="22; 80; 22"
                dur="0.8s"
                calcMode="spline"
                keySplines="0.25 1 0.5 1; 0.25 1 0.5 1"
                keyTimes="0; 0.5; 1"
                repeatCount="1"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      {/* 🍃 NATURAL 2D FIGURE-8 DRIFT */}
      <style>
        {`
          @keyframes liquidDrift {
            0% { transform: translate(0px, 0px) rotate(0deg); }
            20% { transform: translate(3px, -2px) rotate(0.5deg); }
            40% { transform: translate(-2px, 4px) rotate(-0.5deg); }
            60% { transform: translate(-4px, -1px) rotate(1deg); }
            80% { transform: translate(1px, 3px) rotate(-1deg); }
            100% { transform: translate(0px, 0px) rotate(0deg); }
          }
        `}
      </style>

      {/* 🖼️ SINGLE BACKGROUND IMAGE - 15% OPACITY WHEN ZOOMED */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: isZoomedIn ? 0.15 : 1,
          transition: "opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        <img
          src={BACKGROUND_IMAGE}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: isMobile
              ? BACKGROUND_POSITION.mobile
              : BACKGROUND_POSITION.desktop,
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: getContainerTransform(),
          width: CONTAINER_SIZE,
          aspectRatio: "1 / 1",
          transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
          zIndex: 2,
        }}
      >
        {/* OUTER WRAPPER: Continuous smooth 2D drift without zoom popping */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation: "liquidDrift 10s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          {/* THE LIQUID TRIANGLE */}
          <div
            onClick={handleTriangleClick}
            onMouseEnter={() => setIsTriangleHovered(true)}
            onMouseLeave={() => setIsTriangleHovered(false)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              cursor: "pointer",
              pointerEvents: "auto",

              // 1. Safari-specific prefix for the polygon
              WebkitClipPath: `polygon(${CORNERS.artist.x} ${CORNERS.artist.y}, ${CORNERS.journalist.x} ${CORNERS.journalist.y}, ${CORNERS.educator.x} ${CORNERS.educator.y})`,
              clipPath: `polygon(${CORNERS.artist.x} ${CORNERS.artist.y}, ${CORNERS.journalist.x} ${CORNERS.journalist.y}, ${CORNERS.educator.x} ${CORNERS.educator.y})`,

              // 2. Force hardware acceleration by appending translateZ(0)
              transform: `${triangleTransform} translateZ(0)`,

              // 3. Optimize rendering performance in WebKit
              willChange: "transform, filter",

              filter: isTriangleHovered
                ? "url(#liquid-surface) brightness(1.08) drop-shadow(0 0 15px rgba(0,0,0,0.12))"
                : "url(#liquid-surface)",
              transition:
                "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at ${CORNERS.artist.x} ${CORNERS.artist.y}, var(--artist) 0%, transparent 70%), radial-gradient(circle at ${CORNERS.journalist.x} ${CORNERS.journalist.y}, var(--journalist) 0%, transparent 70%), radial-gradient(circle at ${CORNERS.educator.x} ${CORNERS.educator.y}, var(--educator) 0%, transparent 70%)`,
              }}
            />

            <div style={getWaveStyle("artist")} />
            <div style={getWaveStyle("journalist")} />
            <div style={getWaveStyle("educator")} />
          </div>
        </div>

        {/* TOPICS & SVG CIRCULAR WORD CLUSTERS */}
        {["artist", "journalist", "educator"].map((topic) => {
          const active = isVisible(topic);
          const isTopicActive = activeCluster === topic;
          const links = clusterData[topic];
          const [R1, R2] = getRadiuses(topic);

          const baseLeft = parseFloat(currentTopics[topic].left);
          const baseTop = parseFloat(currentTopics[topic].top);

          const currentShiftX = !isTopicActive && activeCluster ? shiftX : 0;
          const currentShiftY = !isTopicActive && activeCluster ? shiftY : 0;

          return (
            <div
              key={topic}
              style={{
                position: "absolute",
                left: `${baseLeft + currentShiftX}%`,
                top: `${baseTop + currentShiftY}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                filter: getBlurStyle(topic),
                transition:
                  "left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              {/* MAIN TOPIC HEADING */}
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                <h2
                  onClick={(e) => handleTopicClick(topic, e)}
                  style={{
                    color: `var(--${topic})`,
                    fontFamily: "BrandFont, sans-serif",
                    textTransform: "lowercase",
                    fontSize: isMobile ? "2rem" : "3rem",
                    margin: 0,
                    cursor: "pointer",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    transition: "transform 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.04)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {isTopicActive ? (
                    <svg
                      width="1.2em"
                      height="1.2em"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={`var(--${topic})`}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: "all 0.3s ease" }}
                    >
                      <circle cx="12" cy="12" r="10" opacity="0.4"></circle>
                      <polyline points="12 16 16 12 12 8"></polyline>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  ) : (
                    t[topic]
                  )}
                </h2>
              </div>

              {/* CURVED TEXT SVG LAYER */}
              <svg
                width={500}
                height={500}
                viewBox="0 0 500 500"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 1,
                  overflow: "visible",
                }}
              >
                {/* DELICATE THIN DOTTED ORBIT RINGS WITH DYNAMIC COLOR FIX */}
                <circle
                  cx="250"
                  cy="250"
                  r={R1}
                  stroke={isZoomedIn ? "var(--text)" : "var(--background)"}
                  strokeWidth="0.8"
                  strokeDasharray="2 5"
                  fill="none"
                  opacity={active ? (isZoomedIn ? 0.12 : 0.3) : 0}
                  style={{ transition: "opacity 0.6s ease, stroke 0.4s ease" }}
                />
                <circle
                  cx="250"
                  cy="250"
                  r={R2}
                  stroke={isZoomedIn ? "var(--text)" : "var(--background)"}
                  strokeWidth="0.8"
                  strokeDasharray="2 5"
                  fill="none"
                  opacity={active ? (isZoomedIn ? 0.12 : 0.3) : 0}
                  style={{ transition: "opacity 0.6s ease, stroke 0.4s ease" }}
                />

                <defs>
                  {[R1, R2].map((r) => (
                    <Fragment key={r}>
                      {/* Top Hemisphere Full Circle (Clockwise) */}
                      <path
                        id={`curve-top-${topic}-${r}`}
                        d={`M 250,${250 + r} A ${r},${r} 0 0,1 250,${250 - r} A ${r},${r} 0 0,1 250,${250 + r}`}
                      />
                      {/* Bottom Hemisphere Full Circle (Counter-Clockwise) */}
                      <path
                        id={`curve-bottom-${topic}-${r}`}
                        d={`M 250,${250 - r} A ${r},${r} 0 0,0 250,${250 + r} A ${r},${r} 0 0,0 250,${250 - r}`}
                      />
                    </Fragment>
                  ))}
                </defs>

                {links.map((link) => (
                  <CurvedLink
                    key={link.title}
                    link={{ ...link, r: link.level === 1 ? R1 : R2 }}
                    topic={topic}
                    active={active}
                    isMobile={isMobile}
                    navigate={navigate}
                    isZoomedIn={isZoomedIn}
                  />
                ))}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
