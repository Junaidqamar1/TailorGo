import { Routes, Route } from "react-router-dom";

import "./index.css";  
import Nav from "./pages/Nav";
import Hero from "./pages/Hero";
import HIW from "./pages/HIW";
import TailorSection from "./pages/Tailors";
import Trust from "./pages/Trust";
import Footer from "./pages/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TailorProfile from "./pages/TailorProfile";

function Home() {
  return (
    <>

    <div className="container">
    <Nav/>
    <Hero/>
    <HIW/>
    <TailorSection/>
    <Trust/>
    <Footer/>
    </div>
    </>

  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tailor-profile" element={<TailorProfile />} />
    </Routes>
  );
}

export default App;