import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import tailorVideo from "../assets/tailorVideo.mp4";

function Signup() {
  return (
    <section className="auth-pro">

      {/* HEADER */}
      <div className="auth-header font1">
        <div className="auth-eyebrow font1">✦ Trusted by 10,000+ customers across India</div>
        <h2 className="text1 f-28">Your Perfect Fit  <span className="text-capsule-blue">Starts Here</span>
        </h2>
        <p>Get perfectly stitched outfits delivered to your door in 48 hours</p>
      </div>

      {/* TRUST BADGES */}
      {/* <div className="auth-trust-row">
        <div className="trust-badge">
          <span className="trust-icon">🔒</span>
          <span>100% Secure</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-badge">
          <span className="trust-icon">⭐</span>
          <span>4.9 Rated Service</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-badge">
          <span className="trust-icon">🪡</span>
          <span>500+ Verified Masters</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-badge">
          <span className="trust-icon">🚀</span>
          <span>48hr Delivery</span>
        </div>
      </div> */}

      {/* MAIN CARD */}
      <div className="auth-layout">

        {/* LEFT — FORM */}
        <div className="auth-customer">

          <div className="auth-form-header">
            <h2>Create Your Account</h2>
            <p>Join free — no subscription needed</p>
          </div>

          <form className="auth-form">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. Arjun Sharma" required />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@email.com" required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Min. 8 characters" required />
            </div>

            <div className="auth-agree">
              <input type="checkbox" id="agree" />
              <label htmlFor="agree">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button className="auth-btn" type="submit">
              Create Free Account →
            </button>
          </form>

          <div className="auth-divider">
            <span>or sign up with</span>
          </div>

          <button className="google-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>

          {/* MINI TRUST */}
          <div className="auth-mini-trust">
            <span>🔒 Your data is encrypted and never sold</span>
          </div>
        </div>

        {/* RIGHT — VIDEO + CTA */}
        <div className="auth-tailor">
          <video autoPlay loop muted playsInline className="video-source">
            <source src={tailorVideo} type="video/mp4" />
          </video>
          <div className="video-overlay" />

          <div className="tailor-content">
            <div className="tailor-eyebrow">For Professionals</div>
            <h2>Are You a Master Tailor?</h2>
            <p>
              Join 500+ verified tailors already earning more on TailorGo.
              Get discovered by customers near you and grow your business — on your own schedule.
            </p>

            <div className="tailor-perks">
              <div className="tailor-perk">✓ Free to join, no commission upfront</div>
              <div className="tailor-perk">✓ Verified badge builds customer trust</div>
              <div className="tailor-perk">✓ Manage orders from your phone</div>
            </div>

            <Link to="/tailor-signup" className="tailor-btn">
              Join as a Tailor →
            </Link>

            <div className="tailor-social-proof">
              <div className="tailor-avatars">
                <div className="t-av" style={{background:"#a8c4e0"}}>R</div>
                <div className="t-av" style={{background:"#b0d4b8"}}>S</div>
                <div className="t-av" style={{background:"#e0c4a8"}}>M</div>
              </div>
              <span>Ibrahim, Savita & 498 others joined this month</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Signup;