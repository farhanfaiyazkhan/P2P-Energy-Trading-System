import Header from "./components/Header.js";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Buy from "./pages/Buy.js";
import Sell from "./pages/Sell.js";

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
      </Routes>
    </main>
  );
}

export default App;
