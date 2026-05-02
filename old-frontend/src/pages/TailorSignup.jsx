import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/tailorSignup.css";
import tailorVideo from "../assets/tailorVideo.mp4";

const SERVICE_SUGGESTIONS = [
  "Shirt Stitching", "Trouser", "Suit", "Sherwani", "Kurta",
  "Blouse", "Lehenga", "Salwar Suit", "Bandhgala", "Alteration",
  "Nehru Jacket", "Pathani", "Indo-Western", "Saree Blouse",
];

const STEPS = ["Basic Info", "Shop Details", "Services", "Documents"];

function TailorSignup() {
  const navigate  = useNavigate();
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError]   = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locating, setLocating] = useState(false);

  const [verificationPhotos, setVerificationPhotos] = useState([]);
  const [workPhotos, setWorkPhotos]                 = useState([]);

  // Dynamic services list
  const [services, setServices] = useState([
    { serviceType: "Shirt Stitching", price: "" },
    { serviceType: "Trouser",         price: "" },
  ]);

  const [form, setForm] = useState({
    name:             "",
    email:            "",
    phoneNo:          "",
    password:         "",
    age:              "",
    gender:           "male",
    experience:       "",
    shopName:         "",
    shopAddress:      "",
    verificationType: "aadharCard",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ── SERVICES ──
  function addService() {
    setServices([...services, { serviceType: "", price: "" }]);
  }
  function removeService(i) {
    setServices(services.filter((_, idx) => idx !== i));
  }
  function updateService(i, field, value) {
    const updated = [...services];
    updated[i][field] = value;
    setServices(updated);
  }

  // ── LOCATION ──
  function handleGetLocation() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support GPS. Please enter address manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Could not get location. Please enable GPS and try again.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  // ── STEP VALIDATION ──
  function validateStep() {
    setError("");
    if (step === 1) {
      if (!form.name || !form.email || !form.phoneNo || !form.password || !form.age || !form.gender || !form.experience)
        return setError("Please fill in all fields."), false;
      if (!/^\d{10}$/.test(form.phoneNo))
        return setError("Phone number must be exactly 10 digits."), false;
      if (form.password.length < 6)
        return setError("Password must be at least 6 characters."), false;
      if (form.age < 18 || form.age > 70)
        return setError("Age must be between 18 and 70."), false;
    }
    if (step === 2) {
      if (!form.shopName)
        return setError("Please enter your shop name."), false;
      if (!coords.lat)
        return setError("Please capture your shop's GPS location."), false;
    }
    if (step === 3) {
      const valid = services.every(s => s.serviceType.trim() && s.price > 0);
      if (!valid || services.length === 0)
        return setError("Add at least one service with a valid price."), false;
    }
    if (step === 4) {
      if (verificationPhotos.length === 0)
        return setError("Please upload at least one verification document."), false;
      if (verificationPhotos.length > 2)
        return setError("Maximum 2 verification photos allowed."), false;
      if (workPhotos.length > 10)
        return setError("Maximum 10 work photos allowed."), false;
    }
    return true;
  }

  function nextStep() {
    if (validateStep()) setStep(s => s + 1);
  }

  // ── SUBMIT ──
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name",             form.name);
    formData.append("email",            form.email);
    formData.append("phoneNo",          form.phoneNo);
    formData.append("password",         form.password);
    formData.append("age",              form.age);
    formData.append("gender",           form.gender);
    formData.append("experience",       form.experience);
    formData.append("shopName",         form.shopName);
    formData.append("shopAddress",      form.shopAddress);
    formData.append("verificationType", form.verificationType);
    formData.append("coordinates[lat]", coords.lat);
    formData.append("coordinates[lng]", coords.lng);
    formData.append("servicesOffered",  JSON.stringify(
      services.map(s => ({ serviceType: s.serviceType, price: Number(s.price) }))
    ));
    verificationPhotos.forEach(f => formData.append("verificationPhotos",    f));
    workPhotos.forEach(f         => formData.append("workExperiencePhotos",  f));

    try {
      const res = await fetch("http://localhost:5000/api/v1/tailor/register/init", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setShowOtp(true);
      } else {
        setError(data.message || "Registration failed. Check your details.");
      }
    } catch {
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP VERIFY ──
  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) return setError("Please enter the 6-digit OTP.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/v1/tailor/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otpCode }),
      });
      if (res.ok) {
        navigate("/tailor-login");
      } else {
        const data = await res.json();
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP SCREEN ──
  if (showOtp) return (
    <section className="auth-pro">
      <div className="auth-header font1">
        <div className="auth-eyebrow">✦ Almost there!</div>
        <h2 className="text1 f-28">Verify Your <span className="text-capsule-blue">Email</span></h2>
        <p>We sent a 6-digit code to <strong>{form.email}</strong></p>
      </div>
      <div className="auth-layout">
        <div className="auth-customer">
          <div className="auth-form-header">
            <h2>Enter OTP</h2>
            <p>Check your email inbox (and spam folder)</p>
          </div>
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="input-group">
              <label>6-Digit OTP</label>
              <input
                type="text"
                maxLength="6"
                placeholder="••••••"
                className="otp-input-field"
                value={otpCode}
                onChange={e => { setOtpCode(e.target.value); setError(""); }}
                required
              />
            </div>
            {error && <div className="auth-error">⚠️ {error}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Start Earning →"}
            </button>
            <button type="button" className="ts-back-link" onClick={() => setShowOtp(false)}>
              ← Edit my details
            </button>
          </form>
        </div>
        <div className="auth-tailor">
          <video autoPlay loop muted playsInline className="video-source">
            <source src={tailorVideo} type="video/mp4" />
          </video>
          <div className="video-overlay" />
          <div className="tailor-content">
            <div className="tailor-eyebrow">One Last Step</div>
            <h2>Verify to Activate</h2>
            <p>After verification, our team will review your documents and approve your profile within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="auth-pro">
      {/* HEADER */}
      <div className="auth-header font1">
        <div className="auth-eyebrow font1">✦ Join 500+ verified tailors across India</div>
        <h2 className="text1 f-28">
          Grow Your <span className="text-capsule-blue">Tailoring Business</span>
        </h2>
        <p>Get more orders, reach new customers, and manage everything in one place</p>
      </div>

      <div className="auth-layout ts-layout-wide">

        {/* LEFT — MULTI-STEP FORM */}
        <div className="auth-customer ts-form-side">

          {/* STEP PROGRESS */}
          <div className="ts-steps">
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`ts-step ${step === i+1 ? "active" : ""} ${step > i+1 ? "done" : ""}`}>
                  <div className="ts-step-circle">{step > i+1 ? "✓" : i+1}</div>
                  <span className="ts-step-label">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`ts-step-line ${step > i+1 ? "done" : ""}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="auth-form-header">
            <h2>{STEPS[step - 1]}</h2>
            <p>Step {step} of {STEPS.length}</p>
          </div>

          <form className="auth-form" onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

            {/* ── STEP 1 — BASIC INFO ── */}
            {step === 1 && (
              <>
                <div className="input-group">
                  <label>Full Name</label>
                  <input name="name" type="text" placeholder="e.g. Ramesh Kumar" value={form.name} onChange={handleChange} required />
                </div>

                <div className="ts-grid-2">
                  <div className="input-group">
                    <label>Email Address</label>
                    <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input name="phoneNo" type="text" placeholder="9876543210" pattern="\d{10}" value={form.phoneNo} onChange={handleChange} required />
                  </div>
                </div>

                <div className="ts-grid-2">
                  <div className="input-group">
                    <label>Age</label>
                    <input name="age" type="number" min="18" max="70" placeholder="25" value={form.age} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="ts-select">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Years of Experience</label>
                  <input name="experience" type="number" min="0" placeholder="e.g. 8" value={form.experience} onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                </div>
              </>
            )}

            {/* ── STEP 2 — SHOP DETAILS ── */}
            {step === 2 && (
              <>
                <div className="input-group">
                  <label>Shop Name</label>
                  <input name="shopName" type="text" placeholder="e.g. Ramesh Tailoring House" value={form.shopName} onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <label>Shop Address <span className="ts-optional">(optional)</span></label>
                  <input name="shopAddress" type="text" placeholder="MG Road, Bandra West, Mumbai" value={form.shopAddress} onChange={handleChange} />
                </div>

                <div className="input-group">
                  <label>Shop GPS Location <span className="ts-required">*</span></label>
                  <div className="ts-location-row">
                    <div className={`ts-location-status ${coords.lat ? "captured" : ""}`}>
                      {coords.lat
                        ? `📍 ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                        : "GPS not captured yet"
                      }
                    </div>
                    <button type="button" className={`ts-gps-btn ${coords.lat ? "captured" : ""}`} onClick={handleGetLocation} disabled={locating}>
                      {locating ? "Locating…" : coords.lat ? "✓ Captured" : "📍 Get GPS"}
                    </button>
                  </div>
                  <p className="ts-field-note">This is used to show you in nearby search results. Must be accurate.</p>
                </div>
              </>
            )}

            {/* ── STEP 3 — SERVICES ── */}
            {step === 3 && (
              <>
                <p className="ts-services-intro">
                  Add the services you offer and your starting price. Customers will see these on your profile.
                </p>
                <div className="ts-services-list">
                  {services.map((svc, i) => (
                    <div key={i} className="ts-service-row">
                      <div className="input-group ts-service-type">
                        <label>Service {i + 1}</label>
                        <input
                          type="text"
                          list="service-suggestions"
                          placeholder="e.g. Sherwani"
                          value={svc.serviceType}
                          onChange={e => updateService(i, "serviceType", e.target.value)}
                          required
                        />
                        <datalist id="service-suggestions">
                          {SERVICE_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                        </datalist>
                      </div>
                      <div className="input-group ts-service-price">
                        <label>Price (₹)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="150"
                          value={svc.price}
                          onChange={e => updateService(i, "price", e.target.value)}
                          required
                        />
                      </div>
                      {services.length > 1 && (
                        <button type="button" className="ts-remove-btn" onClick={() => removeService(i)}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="ts-add-service-btn" onClick={addService}>
                  + Add Another Service
                </button>
              </>
            )}

            {/* ── STEP 4 — DOCUMENTS ── */}
            {step === 4 && (
              <>
                <div className="input-group">
                  <label>Verification Document Type</label>
                  <select name="verificationType" value={form.verificationType} onChange={handleChange} className="ts-select">
                    <option value="aadharCard">Aadhar Card</option>
                    <option value="voterId">Voter ID</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Upload Document Photos <span className="ts-required">*</span></label>
                  <div className="ts-file-upload">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      multiple
                      onChange={e => setVerificationPhotos(Array.from(e.target.files).slice(0, 2))}
                      required
                    />
                    <p className="ts-file-note">Max 2 photos · JPEG / PNG / WebP</p>
                  </div>
                  {verificationPhotos.length > 0 && (
                    <div className="ts-file-preview">
                      {verificationPhotos.map((f, i) => (
                        <span key={i} className="ts-file-chip">📄 {f.name}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <label>Work Photos <span className="ts-optional">(optional)</span></label>
                  <div className="ts-file-upload">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      multiple
                      onChange={e => setWorkPhotos(Array.from(e.target.files).slice(0, 10))}
                    />
                    <p className="ts-file-note">Max 10 photos · These appear in your portfolio</p>
                  </div>
                  {workPhotos.length > 0 && (
                    <div className="ts-file-preview">
                      {workPhotos.map((f, i) => (
                        <span key={i} className="ts-file-chip">🖼️ {f.name}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="ts-approval-notice">
                  ℹ️ After registration, our team will review your documents within <strong>24 hours</strong> before your profile goes live.
                </div>
              </>
            )}

            {/* ERROR */}
            {error && <div className="auth-error">⚠️ {error}</div>}

            {/* NAV BUTTONS */}
            <div className="ts-btn-row">
              {step > 1 && (
                <button type="button" className="ts-back-btn" onClick={() => { setStep(s => s - 1); setError(""); }}>
                  ← Back
                </button>
              )}
              <button className="auth-btn ts-next-btn" type="submit" disabled={loading}>
                {step < 4
                  ? "Continue →"
                  : loading ? "Submitting…" : "Create Account →"
                }
              </button>
            </div>
          </form>

          <p className="auth-switch" style={{ marginTop: 20 }}>
            Already a tailor? <Link to="/tailor-login">Sign in →</Link>
          </p>
          <div className="auth-mini-trust">
            <span>🪡 No upfront fees — start earning immediately</span>
          </div>
        </div>

        {/* RIGHT — VIDEO */}
        <div className="auth-tailor">
          <video autoPlay loop muted playsInline className="video-source">
            <source src={tailorVideo} type="video/mp4" />
          </video>
          <div className="video-overlay" />
          <div className="tailor-content">
            <div className="tailor-eyebrow">Why Join TailorGo?</div>
            <h2>Get More Customers</h2>
            <p>Thousands of customers in your city are looking for a skilled tailor right now.</p>
            <div className="tailor-perks">
              <div className="tailor-perk">✓ Show up in nearby customer searches</div>
              <div className="tailor-perk">✓ Verified badge builds instant trust</div>
              <div className="tailor-perk">✓ Manage all orders from your phone</div>
              <div className="tailor-perk">✓ No commission for the first 3 months</div>
            </div>
            <div className="tailor-social-proof">
              <div className="tailor-avatars">
                <div className="t-av" style={{ background: "#a8c4e0" }}>R</div>
                <div className="t-av" style={{ background: "#b0d4b8" }}>S</div>
                <div className="t-av" style={{ background: "#e0c4a8" }}>M</div>
              </div>
              <span>500+ tailors already growing their business</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default TailorSignup;