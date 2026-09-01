import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

export default function JournalismList({
  category,
  title,
  topMaskDesktop = "7vh",
  topMaskMobile = "7vh",
  bottomMaskDesktop = "5vh",
  bottomMaskMobile = "6vh",
}) {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeLangs, setActiveLangs] = useState(["DE", "EN", "FR"]);

  // Accordion State
  const [openYears, setOpenYears] = useState({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const q = query(
          collection(db, "journalism_links"),
          where("category", "==", category),
          orderBy("date", "desc"),
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLinks(fetched);

        // Auto-expand current year by default
        const currentYearStr = new Date().getFullYear().toString();
        setOpenYears({ [currentYearStr]: true });
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [category]);

  const toggleLang = (code) => {
    setActiveLangs((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code],
    );
  };

  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      const itemDate = item.date ? new Date(item.date) : null;
      const matchesStart =
        !startDate || (itemDate && itemDate >= new Date(startDate));
      const matchesEnd =
        !endDate || (itemDate && itemDate <= new Date(endDate));

      const matchesLang =
        !item.language ||
        item.language === "ALL" ||
        activeLangs.includes(item.language);

      return matchesSearch && matchesStart && matchesEnd && matchesLang;
    });
  }, [links, searchQuery, startDate, endDate, activeLangs]);

  const groupedByYear = useMemo(() => {
    const groups = {};
    filteredLinks.forEach((item) => {
      const year = item.date
        ? new Date(item.date).getFullYear().toString()
        : "—";
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
    });
    return groups;
  }, [filteredLinks]);

  const sortedYears = useMemo(() => {
    return Object.keys(groupedByYear).sort((a, b) => b - a);
  }, [groupedByYear]);

  const isFiltering =
    searchQuery.trim() !== "" ||
    startDate !== "" ||
    endDate !== "" ||
    activeLangs.length < 3;

  const toggleYear = (year) => {
    setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setActiveLangs(["DE", "EN", "FR"]);
  };

  const formatDateMeta = (dateStr, langTag) => {
    if (!dateStr) return langTag || "";
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return `${day}.${month}. — ${langTag || "DE"}`;
  };

  const filterInputStyle = {
    padding: "4px 0",
    border: "none",
    borderBottom: "1px solid var(--secondary)",
    backgroundColor: "transparent",
    color: "var(--text)",
    fontSize: "0.85rem",
    fontFamily: "inherit",
    outline: "none",
    borderRadius: "0",
    transition: "border-color 0.2s ease",
  };

  return (
    <>
      {/* FIXED TOP MASK */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: isMobile ? topMaskMobile : topMaskDesktop,
          backgroundColor: "var(--background)",
          zIndex: 45,
          pointerEvents: "none",
        }}
      />

      {/* FIXED BOTTOM MASK */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: isMobile ? bottomMaskMobile : bottomMaskDesktop,
          backgroundColor: "var(--background)",
          zIndex: 45,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: isMobile ? "100px 16px 100px" : "160px 24px 140px",
          backgroundColor: "var(--background)",
          color: "var(--text)",
          boxSizing: "border-box",
        }}
      >
        {/* EDITORIAL BACK LINK */}
        <div style={{ marginBottom: "16px" }}>
          <Link
            to="/journalism"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--primary)",
              textDecoration: "none",
              fontSize: "0.85rem",
              letterSpacing: "0.3px",
              opacity: 0.7,
              transition: "opacity 0.2s ease, color 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "0.7";
              e.currentTarget.style.color = "var(--primary)";
            }}
          >
            ← {t.journalism}
          </Link>
        </div>

        {/* PAGE TITLE */}
        <h1
          style={{
            fontFamily: "'BrandFont', sans-serif",
            fontSize: isMobile ? "2.2rem" : "3.2rem",
            fontWeight: "normal",
            margin: isMobile ? "0 0 24px 0" : "0 0 40px 0",
            color: "var(--text)",
          }}
        >
          {title}
        </h1>

        {/* MINIMALIST EDITORIAL FILTER BAR */}
        <div
          style={{
            borderBottom: "1px solid var(--secondary)",
            paddingBottom: "20px",
            marginBottom: isMobile ? "32px" : "50px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder={`${t.titleLabel}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 0",
              border: "none",
              borderBottom: "1px solid var(--secondary)",
              backgroundColor: "transparent",
              color: "var(--text)",
              fontSize: isMobile ? "0.95rem" : "1rem",
              fontFamily: "inherit",
              outline: "none",
              borderRadius: "0",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--text)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--secondary)")}
          />

          {/* Filter Controls Row */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? "12px" : "28px",
              alignItems: "center",
              flexWrap: "wrap",
              fontSize: "0.85rem",
              color: "var(--primary)",
            }}
          >
            {/* Language Shorthand Toggles */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Language:</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {["DE", "EN", "FR"].map((code) => {
                  const isActive = activeLangs.includes(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleLang(code)}
                      style={{
                        background: "none",
                        border: "none",
                        borderBottom: isActive
                          ? "2px solid var(--journalism)"
                          : "2px solid transparent",
                        color: isActive ? "var(--text)" : "var(--primary)",
                        opacity: isActive ? 1 : 0.35,
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: isActive ? "600" : "400",
                        padding: "2px 4px",
                        transition: "all 0.2s ease",
                        fontFamily: "inherit",
                      }}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date From */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  ...filterInputStyle,
                  maxWidth: isMobile ? "110px" : "auto",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--text)")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--secondary)")
                }
              />
            </div>

            {/* Date To */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  ...filterInputStyle,
                  maxWidth: isMobile ? "110px" : "auto",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--text)")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--secondary)")
                }
              />
            </div>

            {/* Reset Action */}
            {isFiltering && (
              <button
                onClick={clearFilters}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid var(--text)",
                  color: "var(--text)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  padding: "0 0 1px 0",
                  marginLeft: isMobile ? "0" : "auto",
                  fontFamily: "inherit",
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {loading && <p style={{ color: "var(--primary)" }}>{t.loading}</p>}

        {!loading && filteredLinks.length === 0 && (
          <p style={{ color: "var(--primary)", fontStyle: "italic" }}>
            {t.noItems}
          </p>
        )}

        {/* SWISS YEAR ACCORDION */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {sortedYears.map((year) => {
            const yearItems = groupedByYear[year];
            const isOpen = isFiltering || !!openYears[year];

            return (
              <div
                key={year}
                style={{
                  borderTop: "1px solid var(--text)",
                  paddingTop: isMobile ? "16px" : "24px",
                  paddingBottom: "10px",
                }}
              >
                {/* TWO-COLUMN GRID */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "65px 1fr" : "180px 1fr",
                    gap: isMobile ? "12px" : "20px",
                  }}
                >
                  {/* LEFT COLUMN: YEAR HEADER */}
                  <div
                    onClick={() => toggleYear(year)}
                    style={{
                      cursor: "pointer",
                      userSelect: "none",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      paddingRight: isMobile ? "6px" : "20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: isMobile ? "1.4rem" : "2rem",
                        fontWeight: "400",
                        lineHeight: "1.1",
                        color: "var(--text)",
                      }}
                    >
                      {year}
                    </span>

                    {/* CHEVRON */}
                    <div
                      style={{
                        marginTop: isMobile ? "3px" : "6px",
                        transition:
                          "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        color: "var(--text)",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: ENTRIES */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition:
                        "grid-template-rows 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: isMobile ? "18px" : "24px",
                        }}
                      >
                        {yearItems.map((item, idx) => (
                          <div
                            key={item.id}
                            style={{
                              borderBottom:
                                idx !== yearItems.length - 1
                                  ? "1px solid var(--secondary)"
                                  : "none",
                              paddingBottom: isMobile ? "18px" : "24px",
                            }}
                          >
                            {/* META ROW */}
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--primary)",
                                marginBottom: "6px",
                                letterSpacing: "0.3px",
                              }}
                            >
                              {formatDateMeta(item.date, item.language)}
                            </div>

                            {/* LINK TITLE WITH YELLOW HOVER UNDERLINE */}
                            <div>
                              <h2 style={{ margin: 0, lineHeight: "1.3" }}>
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    color: "var(--text)",
                                    textDecoration: "none",
                                    fontSize: isMobile ? "1.15rem" : "1.4rem",
                                    fontWeight: "400",
                                    borderBottom: "2px solid transparent",
                                    transition:
                                      "border-color 0.25s ease, color 0.25s ease",
                                    display: "inline",
                                    wordBreak: "break-word",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.currentTarget.style.borderBottomColor =
                                      "var(--journalism)")
                                  }
                                  onMouseOut={(e) =>
                                    (e.currentTarget.style.borderBottomColor =
                                      "transparent")
                                  }
                                  onTouchStart={(e) =>
                                    (e.currentTarget.style.borderBottomColor =
                                      "var(--journalism)")
                                  }
                                  onTouchEnd={(e) =>
                                    (e.currentTarget.style.borderBottomColor =
                                      "transparent")
                                  }
                                >
                                  {item.title}
                                </a>
                              </h2>

                              {item.description && (
                                <p
                                  style={{
                                    margin: "6px 0 0 0",
                                    fontSize: isMobile ? "0.88rem" : "0.95rem",
                                    lineHeight: "1.5",
                                    color: "var(--primary)",
                                  }}
                                >
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
