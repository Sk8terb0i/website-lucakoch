import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";

// Main Topic Pages
import Art from "./pages/Art";
import Education from "./pages/Education";
import Journalism from "./pages/Journalism";

// Art Subpages
import Pistache from "./pages/art/Pistache";
import BrassmasterFlash from "./pages/art/BrassmasterFlash";
import HighD from "./pages/art/HighD";
import SenSing from "./pages/art/SenSing";
import Worldbuzzpoems from "./pages/art/Worldbuzzpoems";

// Journalismus Subpages
import AudioPage from "./pages/journalism/AudioPage";
import Artikel from "./pages/journalism/Artikel";
import TvPage from "./pages/journalism/TvPage";

// Bildung Subpages
import AtelierSinneskueche from "./pages/education/AtelierSinneskueche";
import Wiam from "./pages/education/Wiam";
import Gesangskueche from "./pages/education/Gesangskueche";
import Chorprojekte from "./pages/education/Chorprojekte";

// Static Pages
import Biography from "./pages/Biography";
import Media from "./pages/Media";
import Newsletter from "./pages/Newsletter";
import Calendar from "./pages/Calendar";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";

function App() {
  return (
    <LanguageProvider>
      <Header />
      <Footer />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Portfolio />} />

        {/* Core Topic Main Pages */}
        <Route path="/art" element={<Art />} />
        <Route path="/education" element={<Education />} />
        <Route path="/journalism" element={<Journalism />} />

        {/* Kunst Subpages */}
        <Route path="/art/pistache" element={<Pistache />} />
        <Route path="/art/brassmaster-flash" element={<BrassmasterFlash />} />
        <Route path="/art/high-d" element={<HighD />} />
        <Route path="/art/sensing" element={<SenSing />} />
        <Route path="/art/worldbuzzpoems" element={<Worldbuzzpoems />} />

        {/* Journalismus Subpages */}
        <Route path="/journalism/audio" element={<AudioPage />} />
        <Route path="/journalism/artikel" element={<Artikel />} />
        <Route path="/journalism/tv" element={<TvPage />} />

        {/* Bildung Subpages */}
        <Route
          path="/education/atelier-sinneskueche"
          element={<AtelierSinneskueche />}
        />
        <Route path="/education/wiam" element={<Wiam />} />
        <Route path="/education/gesangskueche" element={<Gesangskueche />} />
        <Route path="/education/chorprojekte" element={<Chorprojekte />} />

        {/* Utility Pages */}
        <Route path="/biography" element={<Biography />} />
        <Route path="/media" element={<Media />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
