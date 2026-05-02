import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import tailorVideo from "../assets/tailorVideo.mp4";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const [otpCode, setOtpCode] = useState(""); // State for the 6-digit code
  const [showOtp, setShowOtp] = useState(false); // Toggle between Form and OTP
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // PHASE 1: Initial Registration (Sends OTP to Email)
  const handleRegisterInit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/user/register/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowOtp(true); // Switch to OTP view
      } else {
        const data = await response.json();
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      alert("Server error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // PHASE 2: OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/user/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: otpCode
        }),
      });

      if (response.ok) {
        alert("Account Verified Successfully! Welcome to TailorGo.");
        navigate("/login");
      } else {
        const data = await response.json();
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-pro">
      {/* HEADER stays same */}
      <div className="auth-header font1">
        <h2 className="text1 f-28">Your Perfect Fit <span className="text-capsule-blue">Starts Here</span></h2>
      </div>

      <div className="auth-layout">
        <div className="auth-customer">

          {!showOtp ? (
            /* --- SIGNUP FORM VIEW --- */
            <>
              <div className="auth-form-header">
                <h2>Create Your Account</h2>
                <p>We'll send a code to {formData.email || 'your email'}</p>
              </div>

              <form className="auth-form" onSubmit={handleRegisterInit}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" name="email" onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phoneNo" onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" name="password" onChange={handleChange} required />
                </div>
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? "Sending Code..." : "Get OTP →"}
                </button>
              </form>
            </>
          ) : (
            /* --- OTP VERIFICATION VIEW --- */
            <div className="otp-container fade-in">
              <div className="auth-form-header">
                <h2>Verify Email</h2>
                <p>Enter the 6-digit code sent to <b>{formData.email}</b></p>
              </div>

              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <div className="input-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    placeholder="123456"
                    maxLength="6"
                    className="otp-input-field"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                  />
                </div>
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Complete →"}
                </button>
                <button
                  type="button"
                  className="resend-link"
                  onClick={() => setShowOtp(false)}
                >
                  Edit Email or Try Again
                </button>
              </form>
            </div>
          )}

          {/* SHARED FOOTER ELEMENTS */}
          {!showOtp && (
            <>
              <div className="auth-divider"><span>or</span></div>
              <button className="google-btn">Continue with Google</button>
            </>
          )}
        </div>

        {/* RIGHT VIDEO SIDE stays same */}
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

                <div className="t-av" style={{ background: "#a8c4e0" }}>R</div>

                <div className="t-av" style={{ background: "#b0d4b8" }}>S</div>

                <div className="t-av" style={{ background: "#e0c4a8" }}>M</div>

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