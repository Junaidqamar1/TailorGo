import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function Signup() {
  return (
    <section className="auth">
      <div className="auth-container">

        <div className="auth-left">
          <h1>
            Start Your <span className="highlight">Tailoring Journey</span>
          </h1>
          <p>
            Join now and discover expert tailors near you. Custom outfits,
            perfect fit, zero hassle.
          </p>
        </div>

        <div className="auth-right">
          <h2>Create Account</h2>

          <form className="auth-form">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email address" required />
            <input type="password" placeholder="Password" required />

            <button type="submit" className="auth-btn">
              Sign Up
            </button>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>

      </div>
    </section>
  );
}

export default Signup;