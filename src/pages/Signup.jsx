import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function Signup() {
  return (
    <section className="auth-pro">

      {/* HEADER */}
      <div className="auth-header">
        <h1>
          Start Your <span>Tailoring Journey</span>
        </h1>
        <p>Create your account and get perfectly stitched outfits effortlessly</p>
      </div>

      {/* MAIN */}
      <div className="auth-layout">

        {/* LEFT — SIGNUP FORM */}
        <div className="auth-customer">

          <h2>Create Account</h2>

          <form className="auth-form">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email address" required />
            <input type="password" placeholder="Password" required />

            <button className="auth-btn">Create Account</button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </div>

        {/* RIGHT — TAILOR CTA */}
        <div className="auth-tailor">

          <h2>Join as a Tailor</h2>
          <p>
            Get discovered by customers near you, accept orders, and grow your
            tailoring business with ease.
          </p>

          <Link to="/tailor-login" className="tailor-btn">
            Become a Tailor →
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Signup;