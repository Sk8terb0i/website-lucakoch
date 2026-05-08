import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";

function App() {
  return (
    <Routes>
      {/* Base link that shows everything */}
      <Route path="/" element={<Portfolio category="all" />} />

      {/* Specific links that pre-filter the website */}
      <Route path="/artist" element={<Portfolio category="artist" />} />
      <Route path="/educator" element={<Portfolio category="educator" />} />
      <Route path="/journalist" element={<Portfolio category="journalist" />} />
    </Routes>
  );
}

export default App;
