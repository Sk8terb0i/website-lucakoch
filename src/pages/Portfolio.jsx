import { Link } from "react-router-dom";

// Dummy data to test our filters before wiring up Firebase
const dummyData = [
  { id: 1, title: "Oil Painting Exhibition", category: "artist" },
  { id: 2, title: "Guest Lecture at Uni Zurich", category: "educator" },
  { id: 3, title: "Article: The Future of Art", category: "journalist" },
  { id: 4, title: "Abstract Sculpture", category: "artist" },
];

export default function Portfolio({ category }) {
  // Filter logic: if category is 'all', show everything. Otherwise, match the category.
  const filteredItems =
    category === "all"
      ? dummyData
      : dummyData.filter((item) => item.category === category);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      {/* Navigation Header */}
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1>Luca Koch</h1>
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <Link
            to="/"
            style={{ fontWeight: category === "all" ? "bold" : "normal" }}
          >
            Everything
          </Link>
          <Link
            to="/artist"
            style={{ fontWeight: category === "artist" ? "bold" : "normal" }}
          >
            Artist
          </Link>
          <Link
            to="/educator"
            style={{ fontWeight: category === "educator" ? "bold" : "normal" }}
          >
            Educator
          </Link>
          <Link
            to="/journalist"
            style={{
              fontWeight: category === "journalist" ? "bold" : "normal",
            }}
          >
            Journalist
          </Link>
        </nav>
      </header>

      {/* Filtered Content Grid */}
      <main>
        <h2>
          {category === "all"
            ? "All Work"
            : category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>

        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3>{item.title}</h3>
              <p>Topic: {item.category}</p>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <p>No items found for this category.</p>
          )}
        </div>
      </main>
    </div>
  );
}
