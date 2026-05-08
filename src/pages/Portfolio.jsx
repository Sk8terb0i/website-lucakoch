// src/pages/Portfolio.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

// Dummy data
const dummyData = [
  { id: 1, title: "Oil Painting Exhibition", category: "artist" },
  { id: 2, title: "Guest Lecture at Uni Zurich", category: "educator" },
  { id: 3, title: "Article: The Future of Art", category: "journalist" },
  { id: 4, title: "Abstract Sculpture", category: "artist" },
];

export default function Portfolio({ category }) {
  const [activeCluster, setActiveCluster] = useState(null);

  // ==========================================
  // VIEW 1: THE DESKTOP LANDING (category === "all")
  // ==========================================
  if (category === "all") {
    const getBlurStyle = (clusterName) => {
      if (!activeCluster) return "none";
      if (activeCluster === clusterName) return "none";
      return "blur(6px) opacity(0.7)";
    };

    const clusterStyle = {
      position: "absolute",
      transition: "all 0.4s ease-in-out",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      padding: "2rem",
      borderRadius: "16px",
    };

    const iconStyle = {
      backgroundColor: "var(--background)",
      border: "2px solid var(--secondary)",
      borderRadius: "12px",
      padding: "1rem",
      fontSize: "2rem",
      cursor: "pointer",
      boxShadow: "4px 4px 0px var(--accent)",
      transition: "transform 0.2s, box-shadow 0.2s",
      textDecoration: "none",
      color: "var(--text)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
    };

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
        {/* TOP CENTER: JOURNALIST */}
        <div
          onMouseEnter={() => setActiveCluster("journalist")}
          onMouseLeave={() => setActiveCluster(null)}
          style={{
            ...clusterStyle,
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            filter: getBlurStyle("journalist"),
          }}
        >
          <h2 style={{ color: "var(--primary)", margin: 0 }}>Journalist</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/journalist" style={iconStyle}>
              📰 <span style={{ fontSize: "0.8rem" }}>Articles</span>
            </Link>
            <button
              style={iconStyle}
              onClick={() => alert("Direct Interaction: Opened Notepad!")}
            >
              📝 <span style={{ fontSize: "0.8rem" }}>Drafts</span>
            </button>
          </div>
        </div>

        {/* BOTTOM LEFT: ARTIST */}
        <div
          onMouseEnter={() => setActiveCluster("artist")}
          onMouseLeave={() => setActiveCluster(null)}
          style={{
            ...clusterStyle,
            bottom: "15%",
            left: "10%",
            filter: getBlurStyle("artist"),
          }}
        >
          <h2 style={{ color: "var(--primary)", margin: 0 }}>Artist</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/artist" style={iconStyle}>
              🎨 <span style={{ fontSize: "0.8rem" }}>Gallery</span>
            </Link>
            <button
              style={iconStyle}
              onClick={() => alert("Direct Interaction: Playing Audio Sketch!")}
            >
              🎵 <span style={{ fontSize: "0.8rem" }}>Audio</span>
            </button>
          </div>
        </div>

        {/* BOTTOM RIGHT: EDUCATOR */}
        <div
          onMouseEnter={() => setActiveCluster("educator")}
          onMouseLeave={() => setActiveCluster(null)}
          style={{
            ...clusterStyle,
            bottom: "15%",
            right: "10%",
            filter: getBlurStyle("educator"),
          }}
        >
          <h2 style={{ color: "var(--primary)", margin: 0 }}>Educator</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/educator" style={iconStyle}>
              📚 <span style={{ fontSize: "0.8rem" }}>Courses</span>
            </Link>
            <button
              style={iconStyle}
              onClick={() => alert("Direct Interaction: Download Syllabus")}
            >
              📄 <span style={{ fontSize: "0.8rem" }}>Syllabus</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE FILTERED LIST (category === "artist", etc.)
  // ==========================================
  const filteredItems = dummyData.filter((item) => item.category === category);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            color: "var(--primary)",
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
                category === "artist" ? "var(--primary)" : "var(--secondary)",
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
                category === "educator" ? "var(--primary)" : "var(--secondary)",
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
                  ? "var(--primary)"
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
            borderBottom: "2px solid var(--accent)",
            paddingBottom: "0.5rem",
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>

        <div style={{ display: "grid", gap: "1.5rem", marginTop: "2rem" }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--secondary)",
                borderLeft: "6px solid var(--accent)",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--primary)" }}>
                {item.title}
              </h3>
              <span
                style={{
                  backgroundColor: "var(--secondary)",
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
          {filteredItems.length === 0 && (
            <p style={{ color: "var(--text)", opacity: 0.7 }}>
              No items found for this category.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
