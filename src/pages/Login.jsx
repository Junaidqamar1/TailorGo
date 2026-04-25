import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  return (
    <section className="auth">
      <div className="auth-container">

        <div className="auth-left">
          <h1>
            Stitch Your <span className="highlight">Perfect Fit</span>
          </h1>
          <p>
            Connect with skilled local tailors and get your outfits crafted
            exactly the way you want — right from your home.
          </p>
        </div>

        <div className="auth-right">
          <h2>Welcome Back</h2>

          <form className="auth-form">
            <input type="email" placeholder="Email address" required />
            <input type="password" placeholder="Password" required />

            <button type="submit" className="auth-btn">
              Login
            </button>

            <p className="auth-switch">
              Don’t have an account? 
              <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>

      </div>
    </section>
  );
}

export default Login;