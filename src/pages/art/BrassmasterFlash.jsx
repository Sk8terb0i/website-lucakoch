import { Link } from "react-router-dom";

export default function BrassmasterFlash() {
  return (
    <article
      style={{
        maxWidth: "800px",
        margin: "12vh auto 8vh auto",
        padding: "2rem",
      }}
    >
      <Link
        to="/art"
        style={{ color: "var(--text)", opacity: 0.6, textDecoration: "none" }}
      >
        ← Back to Kunst
      </Link>
      <h1
        style={{
          fontSize: "3rem",
          color: "var(--art)",
          fontFamily: "Satoshi, sans-serif",
          marginTop: "1rem",
        }}
      >
        brassmaster flash
      </h1>
      <p style={{ color: "var(--primary)", lineHeight: 1.6 }}>
        [ Placeholder content for brassmaster flash ]
      </p>
    </article>
  );
}
