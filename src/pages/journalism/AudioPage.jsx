import { Link } from "react-router-dom";

export default function AudioPage() {
  return (
    <article
      style={{
        maxWidth: "800px",
        margin: "12vh auto 8vh auto",
        padding: "2rem",
      }}
    >
      <Link
        to="/journalism"
        style={{ color: "var(--text)", opacity: 0.6, textDecoration: "none" }}
      >
        ← Back to Journalismus
      </Link>
      <h1
        style={{
          fontSize: "3rem",
          color: "var(--journalism)",
          fontFamily: "Satoshi, sans-serif",
          marginTop: "1rem",
        }}
      >
        audio
      </h1>
      <p style={{ color: "var(--primary)", lineHeight: 1.6 }}>
        [ Placeholder content for audio ]
      </p>
    </article>
  );
}
