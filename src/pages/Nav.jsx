import React from 'react'
import "../styles/nav.css"
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'
function Nav() {
//   const toggle = document.querySelector(".menu-toggle");
// const nav = document.querySelector(".nav-links");

// toggle.addEventListener("click", () => {
//   nav.classList.toggle("active");
// });
  return (
<nav class="navbar">
  <div class="nav-container max-w">
    <Link to="/" class="logo">
      {/* <span class="logo-text">Tailor<span>Go</span></span> */}
      <img src={logo} alt="" />
    </Link>
    <div class="menu-toggle">☰</div>

    <ul class="nav-links">
      <li><a href="#how-it-works">How it Works</a></li>
      <li><a href="#find-tailors">Find Tailors</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>

    <div class="nav-actions">
      <Link to="/tailor-signup" class="btn-secondary">Partner Login</Link>
      <Link to="/login" class="btn-primary">Book Now</Link>
    </div>
  </div>
</nav>
  )
}

export default Nav