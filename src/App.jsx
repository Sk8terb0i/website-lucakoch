import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";

// Main topic page imports
import Art from "./pages/Art";
import Education from "./pages/Education";
import Journalism from "./pages/Journalism";

// Other static pages
import Biography from "./pages/Biography";
import Media from "./pages/Media";
import Newsletter from "./pages/Newsletter";
import Calendar from "./pages/Calendar";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";

function App() {
  return (
    <LanguageProvider>
      <Header />
      <Footer />

      <Routes>
        {/* Main interactive desktop view */}
        <Route path="/" element={<Portfolio />} />

        {/* Individual Topic Pages */}
        <Route path="/art" element={<Art />} />
        <Route path="/education" element={<Education />} />
        <Route path="/journalism" element={<Journalism />} />

        {/* Other static pages */}
        <Route path="/biography" element={<Biography />} />
        <Route path="/media" element={<Media />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
