import React from 'react'
import "../styles/nav.css"
import logo from "../assets/logo.png"
function Nav() {
//   const toggle = document.querySelector(".menu-toggle");
// const nav = document.querySelector(".nav-links");

// toggle.addEventListener("click", () => {
//   nav.classList.toggle("active");
// });
  return (
<nav class="navbar">
  <div class="nav-container max-w">
    <div class="logo">
      {/* <span class="logo-text">Tailor<span>Go</span></span> */}
      <img src={logo} alt="" />
    </div>
    <div class="menu-toggle">☰</div>

    <ul class="nav-links">
      <li><a href="#how-it-works">How it Works</a></li>
      <li><a href="#find-tailors">Find Tailors</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>

    <div class="nav-actions">
      <a href="#" class="btn-secondary">Partner Login</a>
      <a href="#" class="btn-primary">Book Now</a>
    </div>
  </div>
</nav>
  )
}

export default Nav