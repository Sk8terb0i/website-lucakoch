import { Link } from "react-router-dom";

export default function Gesangskueche() {
  return (
    <article
      style={{
        maxWidth: "800px",
        margin: "12vh auto 8vh auto",
        padding: "2rem",
      }}
    >
      <Link
        to="/education"
        style={{ color: "var(--text)", opacity: 0.6, textDecoration: "none" }}
      >
        ← Back to Bildung
      </Link>
      <h1
        style={{
          fontSize: "3rem",
          color: "var(--education)",
          fontFamily: "Satoshi, sans-serif",
          marginTop: "1rem",
        }}
      >
        Gesangsküche
      </h1>
      <p style={{ color: "var(--primary)", lineHeight: 1.6 }}>
        [ Placeholder content for Gesangsküche ]
      </p>
    </article>
  );
}
