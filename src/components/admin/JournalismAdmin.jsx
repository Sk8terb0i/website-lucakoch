import { useState, useEffect } from "react";
import { db } from "../../firebase";
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
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations";

export default function JournalismAdmin({ user }) {
  const { lang } = useLanguage();
  const t = translations[lang];

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
      showFeedback(t.loadError || "Failed to load content.", "error");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchItems();
    cancelEdit();
  }, [listCategory, user]);

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
      isEdited: true,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "journalism_links", editId), docData);
        showFeedback(t.updateSuccess || "Updated successfully!");
      } else {
        await addDoc(collection(db, "journalism_links"), {
          ...docData,
          createdAt: new Date().toISOString(),
        });
        showFeedback(t.addSuccess || "Added successfully!");
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
    if (!window.confirm(t.deleteConfirm || "Delete this entry?")) return;
    setIsLoadingList(true);
    try {
      await deleteDoc(doc(db, "journalism_links", id));
      showFeedback(t.deleteSuccess || "Deleted successfully.", "success");
      fetchItems();
    } catch (error) {
      showFeedback(t.deleteError || "Error deleting.", "error");
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
    borderRadius: "4px",
    border: "1px solid var(--secondary)",
    fontSize: "1rem",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "var(--background)",
    color: "var(--text)",
    outline: "none",
  };

  const buttonStyle = {
    backgroundColor: "var(--text)",
    color: "var(--background)",
    padding: "14px 20px",
    borderRadius: "4px",
    border: "1px solid var(--text)",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "500",
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          background: feedback?.type === "error" ? "#C94A4A" : "var(--text)",
          color: "var(--background)",
          padding: "12px 24px",
          borderRadius: "4px",
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
          background: "transparent",
          marginBottom: "40px",
        }}
      >
        {editId && (
          <div
            style={{
              background: "var(--journalism)",
              color: "#000",
              padding: "10px 15px",
              borderRadius: "4px",
              marginBottom: "20px",
              fontWeight: "500",
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
                  fontWeight: "500",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
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
                  fontWeight: "500",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {t.category || "Category"}
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
                  fontWeight: "500",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
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
                <option value="ALL">{t.allLanguages || "All Languages"}</option>
              </select>
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--primary)",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
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
                fontWeight: "500",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
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
                fontWeight: "500",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
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
                    borderRadius: "4px",
                    background: "transparent",
                    border: "1px solid var(--text)",
                    color: "var(--text)",
                    textDecoration: "none",
                    fontWeight: "500",
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
                ? t.loading || "Loading..."
                : editId
                  ? t.updateBtn || "Update"
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
                  border: "1px solid var(--primary)",
                }}
              >
                {t.cancel}
              </button>
            )}
          </div>
        </form>
      </div>

      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "var(--secondary)",
          margin: "40px 0",
        }}
      />

      {/* LIST TABS */}
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
              border: "1px solid var(--secondary)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: listCategory === tab ? "500" : "400",
              backgroundColor:
                listCategory === tab ? "var(--text)" : "transparent",
              color:
                listCategory === tab ? "var(--background)" : "var(--primary)",
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
            padding: "20px 0",
          }}
        >
          {t.noItems}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item) => {
            const isUnedited = item.isEdited === false;

            return (
              <div
                key={item.id}
                style={{
                  background: "var(--background)",
                  padding: "20px",
                  borderRadius: "4px",
                  border: isUnedited
                    ? "1px dashed var(--primary)"
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
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--background)",
                        background: "var(--primary)",
                        padding: "2px 6px",
                        borderRadius: "2px",
                        fontWeight: "bold",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.language || "DE"}
                    </span>
                    <span
                      style={{ fontSize: "0.85rem", color: "var(--primary)" }}
                    >
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4
                    style={{
                      margin: "0 0 5px 0",
                      fontSize: "1.1rem",
                      color: "var(--text)",
                      fontWeight: "500",
                    }}
                  >
                    {item.title}
                  </h4>
                </div>

                <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
                  <button
                    onClick={() => handleEditClick(item)}
                    title={t.edit}
                    style={{
                      padding: "8px",
                      border: "none",
                      background: "transparent",
                      color: "var(--primary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      opacity: 0.6,
                      transition: "opacity 0.2s ease, color 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = 1;
                      e.currentTarget.style.color = "var(--text)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = 0.6;
                      e.currentTarget.style.color = "var(--primary)";
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title={t.delete}
                    style={{
                      padding: "8px",
                      border: "none",
                      background: "transparent",
                      color: "var(--primary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      opacity: 0.6,
                      transition: "opacity 0.2s ease, color 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = 1;
                      e.currentTarget.style.color = "#C94A4A";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = 0.6;
                      e.currentTarget.style.color = "var(--primary)";
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
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
