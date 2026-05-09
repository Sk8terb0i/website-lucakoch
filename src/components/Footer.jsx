export default function Footer() {
  const iconStyle = {
    width: "20px",
    height: "20px",
    fill: "none",
    stroke: "var(--text)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    cursor: "pointer",
    transition: "opacity 0.2s",
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
        opacity: 0.95, // Lowered opacity matching the header
      }}
    >
      {/* THE THIN DELINEATION LINE */}
      <div
        style={{
          height: "1px",
          backgroundColor: "var(--text)",
          opacity: 0.15, // Extremely subtle so it doesn't distract
          margin: "0 4.5rem", // Matches the left/right padding of the header perfectly
        }}
      />

      {/* FOOTER ICONS */}
      <div
        style={{
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          gap: "2.5rem",
        }}
      >
        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          style={{ pointerEvents: "auto" }}
        >
          <svg style={iconStyle} viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>

        {/* TikTok */}
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          style={{ pointerEvents: "auto" }}
        >
          <svg style={iconStyle} viewBox="0 0 24 24">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          style={{ pointerEvents: "auto" }}
        >
          <svg style={iconStyle} viewBox="0 0 24 24">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
          </svg>
        </a>
      </div>
    </footer>
  );
}
