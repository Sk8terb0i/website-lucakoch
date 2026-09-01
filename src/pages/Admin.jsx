import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function Admin() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Independent Category States: list Category controls the lower list, formCategory controls the input form
  const [listCategory, setListCategory] = useState("artikel");
  const [formCategory, setFormCategory] = useState("artikel");

  const [items, setItems] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [entryLang, setEntryLang] = useState("DE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchItems = async () => {
    if (!user) return;
    setIsLoadingList(true);
    try {
      const q = query(
        collection(db, "journalism_links"),
        where("category", "==", listCategory),
        orderBy("date", "desc"),
      );
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      showFeedback("Failed to load content.", "error");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchItems();
    cancelEdit();
  }, [listCategory, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError("Login failed. Verify credentials.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const docData = {
      title,
      date,
      category: formCategory,
      description,
      link,
      language: entryLang,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "journalism_links", editId), docData);
        showFeedback(t.update + " successful!");
      } else {
        await addDoc(collection(db, "journalism_links"), {
          ...docData,
          createdAt: new Date().toISOString(),
        });
        showFeedback("Added successfully!");
      }
      setListCategory(formCategory);
      cancelEdit();
      fetchItems();
    } catch (error) {
      showFeedback(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setTitle(item.title || "");
    setDate(item.date || "");
    setDescription(item.description || "");
    setLink(item.link || "");
    setEntryLang(item.language || "DE");
    setFormCategory(item.category || "artikel");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setDate("");
    setDescription("");
    setLink("");
    setEntryLang("DE");
    setFormCategory(listCategory);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    setIsLoadingList(true);
    try {
      await deleteDoc(doc(db, "journalism_links", id));
      showFeedback(t.delete + " successful.", "success");
      fetchItems();
    } catch (error) {
      showFeedback("Error deleting.", "error");
      setIsLoadingList(false);
    }
  };

  const getTabName = (tabKey) => {
    if (tabKey === "artikel") return t.articles;
    if (tabKey === "audio") return t.audio;
    if (tabKey === "tv") return t.tv;
    return tabKey;
  };

  const inputStyle = {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid var(--secondary)",
    fontSize: "1rem",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "var(--background)",
    color: "var(--text)",
  };

  const buttonStyle = {
    backgroundColor: "var(--primary)",
    color: "var(--accent)",
    padding: "14px 20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
  };

  const cardStyle = {
    background: "var(--accent)",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
    border: "1px solid var(--secondary)",
    marginBottom: "40px",
  };

  if (isAuthLoading)
    return (
      <div style={{ paddingTop: "160px", textAlign: "center" }}>
        {t.loading}
      </div>
    );

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
              color: "var(--primary)",
            }}
          >
            {t.adminLogin}
          </h2>
          {loginError && (
            <div
              style={{
                color: "#a95051",
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
        maxWidth: "900px",
        margin: "0 auto",
        padding: "160px 20px 80px",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          background: feedback?.type === "error" ? "#a95051" : "var(--primary)",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          zIndex: 1000,
          opacity: feedback ? 1 : 0,
          pointerEvents: feedback ? "auto" : "none",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          transform: feedback ? "translate(-50%, 0)" : "translate(-50%, -20px)",
        }}
      >
        {feedback?.message}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2 style={{ color: "var(--text)", margin: 0, fontSize: "2rem" }}>
          {t.contentManager}
        </h2>
        <button
          onClick={() => signOut(auth)}
          style={{
            ...buttonStyle,
            backgroundColor: "transparent",
            color: "var(--primary)",
            border: "2px solid var(--primary)",
          }}
        >
          {t.logout}
        </button>
      </div>

      {/* FORM CARD */}
      <div
        style={{
          ...cardStyle,
          border: editId ? "2px solid var(--journalism)" : cardStyle.border,
        }}
      >
        {editId && (
          <div
            style={{
              background: "var(--journalism)",
              color: "#000",
              padding: "10px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            {t.editingNotice}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "2 1 300px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--primary)",
                  fontWeight: "600",
                }}
              >
                {t.titleLabel}
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 150px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--primary)",
                  fontWeight: "600",
                }}
              >
                Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                style={inputStyle}
              >
                <option value="artikel">{t.articles}</option>
                <option value="audio">{t.audio}</option>
                <option value="tv">{t.tv}</option>
              </select>
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--primary)",
                  fontWeight: "600",
                }}
              >
                {t.languageLabel}
              </label>
              <select
                value={entryLang}
                onChange={(e) => setEntryLang(e.target.value)}
                style={inputStyle}
              >
                <option value="DE">{t.german}</option>
                <option value="EN">{t.english}</option>
                <option value="FR">{t.french}</option>
                <option value="ALL">{t.allLanguages}</option>
              </select>
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--primary)",
                  fontWeight: "600",
                }}
              >
                {t.publishDate}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--primary)",
                fontWeight: "600",
              }}
            >
              {t.shortDesc}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--primary)",
                fontWeight: "600",
              }}
            >
              {t.linkUrl}
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                style={{ ...inputStyle, flex: 1 }}
              />
              {editId && link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 16px",
                    borderRadius: "8px",
                    background: "var(--background)",
                    border: "2px solid var(--primary)",
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  ↗ Open
                </a>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...buttonStyle,
                flex: 1,
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting
                ? t.loading
                : editId
                  ? t.update
                  : `${t.save} ${getTabName(formCategory)}`}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  ...buttonStyle,
                  flex: 1,
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                  border: "2px solid var(--primary)",
                }}
              >
                {t.cancel}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST TABS - POSITIONED BELOW FORM & ABOVE LIST */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["artikel", "audio", "tv"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setListCategory(tab);
              cancelEdit();
            }}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: listCategory === tab ? "600" : "500",
              backgroundColor:
                listCategory === tab ? "var(--primary)" : "var(--background)",
              color: listCategory === tab ? "var(--accent)" : "var(--primary)",
              boxShadow:
                listCategory === tab ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {getTabName(tab)}
          </button>
        ))}
      </div>

      {isLoadingList ? (
        <p style={{ color: "var(--primary)" }}>{t.loading}</p>
      ) : items.length === 0 ? (
        <p
          style={{
            color: "var(--primary)",
            fontStyle: "italic",
            background: "var(--accent)",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          {t.noItems}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {items.map((item) => {
            const isUnedited =
              item.title &&
              item.title.length > 1 &&
              item.title.slice(1) === item.title.slice(1).toLowerCase();

            return (
              <div
                key={item.id}
                style={{
                  background: "var(--accent)",
                  padding: "24px",
                  borderRadius: "12px",
                  border: isUnedited
                    ? "2px dashed var(--primary)"
                    : "1px solid var(--secondary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--background)",
                        background: "var(--primary)",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.language || "DE"}
                    </span>
                    <span
                      style={{ fontSize: "0.9rem", color: "var(--primary)" }}
                    >
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4
                    style={{
                      margin: "0 0 5px 0",
                      fontSize: "1.15rem",
                      color: "var(--text)",
                    }}
                  >
                    {item.title}
                  </h4>
                </div>
                <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                  <button
                    onClick={() => handleEditClick(item)}
                    style={{
                      padding: "8px 16px",
                      border: "2px solid var(--primary)",
                      background: "transparent",
                      color: "var(--primary)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    {t.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: "8px 16px",
                      border: "none",
                      background: "#a95051",
                      color: "white",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
