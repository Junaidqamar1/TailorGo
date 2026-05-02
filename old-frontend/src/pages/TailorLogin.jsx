import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import tailorVideo from "../assets/tailorVideo.mp4";
import { useAuth } from "../context/AuthContext"; // ← ADD THIS

function TailorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ← ADD THIS
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/tailor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends/receives httpOnly cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ THIS IS WHAT WAS MISSING
        // Tell AuthContext who is logged in so Nav updates immediately
        login({
          name:  data.tailor?.name  || data.name  || "Tailor",
          email: data.tailor?.email || data.email || formData.email,
          role:  "tailor",
        });
        navigate("/tailor-dashboard");
      } else {
        if (response.status === 403) {
          setError("Your account is pending admin approval. Please wait for verification.");
        } else {
          setError(data.error || data.message || "Invalid email or password.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-pro">
      {/* HEADER */}
      <div className="auth-header font1">
        <div className="auth-eyebrow font1">✦ Welcome back, tailor</div>
        <h2 className="text1 f-28">
          Access Your <span className="text-capsule-blue">Dashboard</span>
        </h2>
        <p>Manage orders, track customers, and grow your business</p>
      </div>

      <div className="auth-layout">
        {/* LEFT — FORM */}
        <div className="auth-customer">
          <div className="auth-form-header">
            <h2>Tailor Login</h2>
            <p>Continue managing your work</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="auth-error">
                ⚠️ {error}
              </div>
            )}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button className="google-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-switch">
            New here? <Link to="/tailor-signup">Create account →</Link>
          </p>

          <div className="auth-mini-trust">
            <span>🔒 Secure login for verified professionals</span>
          </div>
        </div>

        {/* RIGHT — VIDEO */}
        <div className="auth-tailor">
          <video autoPlay loop muted playsInline className="video-source">
            <source src={tailorVideo} type="video/mp4" />
          </video>
          <div className="video-overlay" />
          <div className="tailor-content">
            <div className="tailor-eyebrow">For Professionals</div>
            <h2>Keep Your Business Running</h2>
            <p>Track orders, manage clients, and stay organized effortlessly.</p>
            <div className="tailor-perks">
              <div className="tailor-perk">✓ Real-time order notifications</div>
              <div className="tailor-perk">✓ Customer management tools</div>
              <div className="tailor-perk">✓ Earnings dashboard</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TailorLogin;