import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Header from "./components/Header";
import Footer from "./components/Footer";

// --- ADD THIS LINE ---
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Header />
      <Footer />

      <Routes>
        <Route path="/" element={<Portfolio category="all" />} />
        <Route path="/artist" element={<Portfolio category="artist" />} />
        <Route path="/educator" element={<Portfolio category="educator" />} />
        <Route
          path="/journalist"
          element={<Portfolio category="journalist" />}
        />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
