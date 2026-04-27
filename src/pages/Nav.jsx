import React, { useState } from 'react'
import "../styles/nav.css"
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container max-w">

        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>

        {/* TOGGLE BUTTON */}
        <div 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        {/* <ul className="nav-links"> */}
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it Works</a></li>
          <li><a href="#find-tailors" onClick={() => setMenuOpen(false)}>Find Tailors</a></li>
          <li><a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a></li>
          <Link to="/tailor-signup" className="btn-secondary mob-btn">Partner Login</Link>
          <Link to="/login" className="btn-primary mob-btn">Book Now</Link>
        </ul>
        {/* <ul className={`mobile-nav ${menuOpen ? "onn" : ""}`}> 
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it Works</a></li>
          <li><a href="#find-tailors" onClick={() => setMenuOpen(false)}>Find Tailors</a></li>
          <li><a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a></li>
          
            </ul> */}
        {/* ACTIONS */}
        <div className="nav-actions">
          <Link to="/tailor-signup" className="btn-secondary">Partner Login</Link>
          <Link to="/login" className="btn-primary">Book Now</Link>
        </div>

      </div>
    </nav>
  )
}

export default Nav