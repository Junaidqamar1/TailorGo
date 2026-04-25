import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  return (
    <section className="auth-pro">

      {/* TOP BRAND */}
      <div className="auth-header">
        <h1>
          Tailoring, <span>Reimagined</span>
        </h1>
        <p>Seamless stitching. Real tailors. Delivered to your door.</p>
      </div>

      {/* MAIN CARD */}
      <div className="auth-layout">

        {/* LEFT — CUSTOMER */}
        <div className="auth-customer">

          <h2>Login as Customer</h2>

          <form className="auth-form">
            <input type="email" placeholder="Email address" />
            <input type="password" placeholder="Password" />

            <button className="auth-btn">Continue</button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/signup">Create account</Link>
          </p>

        </div>

        {/* RIGHT — TAILOR CTA */}
        <div className="auth-tailor">

          <h2>Are you a Tailor?</h2>
          <p>
            Start receiving orders from customers near you and grow your business.
          </p>

          <Link to="/tailor-login" className="tailor-btn">
            Become a Tailor →
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Login;