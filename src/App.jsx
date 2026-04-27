import { Routes, Route } from "react-router-dom";
import "./index.css";

import Nav from "./pages/Nav";
import Footer from "./pages/Footer";

import Hero from "./pages/Hero";
import HIW from "./pages/HIW";
import TailorSection from "./pages/Tailors";
import Trust from "./pages/Trust";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TailorProfile from "./pages/TailorProfile";
import TailorLogin from "./pages/TailorLogin";
import TailorSignup from "./pages/TailorSignup";

function Home() {
  return (
    <>
      <Hero />
      <HIW />
      <TailorSection />
      <Trust />
    </>
  );
}

function App() {
  return (
    <>
      <Nav />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tailor-profile" element={<TailorProfile />} />
          <Route path="/tailor-login" element={<TailorLogin />} />
          <Route path="/tailor-signup" element={<TailorSignup />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;