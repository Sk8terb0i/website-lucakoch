import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";
import JournalismAdmin from "../components/admin/JournalismAdmin";

export default function Admin() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("journalism");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError(t.loginError || "Login failed. Verify credentials.");
    }
  };

  const inputStyle = {
    padding: "14px 16px",
    borderRadius: "4px",
    border: "1px solid var(--secondary)",
    fontSize: "1rem",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "var(--background)",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const buttonStyle = {
    backgroundColor: "var(--text)",
    color: "var(--background)",
    padding: "14px 20px",
    borderRadius: "4px",
    border: "1px solid var(--text)",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
  };

  const cardStyle = {
    background: "var(--accent)",
    borderRadius: "4px",
    padding: "40px",
    border: "1px solid var(--secondary)",
    marginBottom: "40px",
  };

  if (isAuthLoading) {
    return (
      <div style={{ paddingTop: "160px", textAlign: "center" }}>
        {t.loading}
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          paddingTop: "160px",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            ...cardStyle,
            maxWidth: "400px",
            width: "100%",
            height: "fit-content",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
              color: "var(--text)",
              fontWeight: "400",
            }}
          >
            {t.adminLogin}
          </h2>
          {loginError && (
            <div
              style={{
                color: "#C94A4A",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {loginError}
            </div>
          )}
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              {t.signIn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "160px 20px 80px",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h1
          style={{
            color: "var(--text)",
            margin: 0,
            fontFamily: "'BrandFont', sans-serif",
            fontSize: "3.2rem",
            fontWeight: "normal",
            lineHeight: "1",
          }}
        >
          {t.contentManager || "Admin Panel"}
        </h1>

        <button
          onClick={() => signOut(auth)}
          title={t.logout}
          style={{
            background: "none",
            border: "none",
            color: "var(--primary)",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            opacity: 0.5,
            transition: "opacity 0.2s ease",
            marginBottom: "4px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseOut={(e) => (e.currentTarget.style.opacity = 0.5)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        {["journalism"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "16px 32px",
                backgroundColor: isActive
                  ? "var(--accent)"
                  : "color-mix(in srgb, var(--secondary) 20%, transparent)",
                borderTop: "1px solid var(--secondary)",
                borderLeft: "1px solid var(--secondary)",
                borderRight: "1px solid var(--secondary)",
                borderBottom: isActive
                  ? "1px solid var(--accent)"
                  : "1px solid var(--secondary)",
                borderRadius: "4px 4px 0 0",
                color: isActive ? "var(--text)" : "var(--primary)",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "inherit",
                fontWeight: "500",
                position: "relative",
                top: "1px",
                zIndex: isActive ? 2 : 1,
                transition: "background-color 0.2s ease, color 0.2s ease",
                textTransform: "capitalize",
              }}
            >
              {t[tab] || tab}
            </button>
          );
        })}
      </div>

      <div
        style={{
          backgroundColor: "var(--accent)",
          border: "1px solid var(--secondary)",
          borderRadius: "0 4px 4px 4px",
          padding: "40px",
          minHeight: "600px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {activeTab === "journalism" && <JournalismAdmin user={user} />}
      </div>
    </div>
  );
}
