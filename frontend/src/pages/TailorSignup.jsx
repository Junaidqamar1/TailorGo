import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/tailorSignup.css";
import tailorVideo from "../assets/tailorVideo.mp4";
import { authApi } from "../lib/api";

/* ── CONSTANTS ── */
const STEPS = ["Basic Info", "Shop Details", "Services", "Documents"];

const SERVICE_OPTIONS = [
  "Alteration", "Blouse Stitching", "Kurta Stitching", "Pajama Stitching",
  "Salwar Suit", "Anarkali Suit", "Punjabi Suit", "Patiala Suit",
  "Lehenga Stitching", "Saree Fall Pico", "Saree Blouse", "Petticoat",
  "Custom Shirt", "Formal Shirt", "T-Shirt Alteration", "Trouser Stitching",
  "Pant Alteration", "Jeans Alteration", "Suit Stitching", "Blazer Stitching",
  "Waistcoat", "Sherwani", "Indo Western", "Nehru Jacket", "Bandhgala",
  "Jodhpuri Suit", "Wedding Outfit", "Gown Stitching", "Evening Dress",
  "Skirt Stitching", "Kids Wear", "School Uniform", "Corporate Uniform",
  "Apron Stitching", "Jacket Alteration", "Coat Alteration", "Zip Replacement",
  "Button Fixing", "Embroidery Work", "Hand Work", "Lining Work",
  "Measurement Visit", "Custom Service",
];

const initialForm = {
  name: "", shopName: "", email: "", phoneNo: "",
  password: "", age: "", gender: "male", experience: "",
  shopAddress: "", verificationType: "aadharCard",
};

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
function TailorSignup() {
  const navigate = useNavigate();

  /* ── STATE ── */
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState(initialForm);
  const [services, setServices] = useState([
    { serviceType: "Alteration",  customServiceType: "", price: "" },
    { serviceType: "Kurta Stitching", customServiceType: "", price: "" },
  ]);
  const [coords, setCoords]   = useState({ lat: null, lng: null });
  const [locating, setLocating] = useState(false);
  const [verificationPhotos, setVerificationPhotos] = useState([]);
  const [workPhotos, setWorkPhotos]   = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  /* ── HANDLERS ── */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Services
  function addService() {
    setServices([...services, { serviceType: "", customServiceType: "", price: "" }]);
  }
  function removeService(i) {
    setServices(services.filter((_, idx) => idx !== i));
  }
  function updateService(i, field, value) {
    const updated = [...services];
    updated[i][field] = value;
    if (field === "serviceType" && value !== "Custom Service") {
      updated[i].customServiceType = "";
    }
    setServices(updated);
  }

  // GPS
  function handleGetLocation() {
    if (!navigator.geolocation) {
      setError("GPS not supported. Enter lat/lng manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Could not read location. Please enable GPS and try again.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  /* ── VALIDATION ── */
  function validateStep() {
    setError("");
    if (step === 1) {
      if (!form.name || !form.email || !form.phoneNo || !form.password || !form.age || !form.experience)
        return setError("Please fill in all fields."), false;
      if (!/^\d{10}$/.test(form.phoneNo))
        return setError("Phone number must be exactly 10 digits."), false;
      if (form.password.length < 6)
        return setError("Password must be at least 6 characters."), false;
      if (Number(form.age) < 18 || Number(form.age) > 70)
        return setError("Age must be between 18 and 70."), false;
    }
    if (step === 2) {
      if (!form.shopName)
        return setError("Please enter your shop name."), false;
      if (!coords.lat)
        return setError("Please capture your shop's GPS location."), false;
    }
    if (step === 3) {
      const validServices = services.filter(s => {
        const type = s.serviceType === "Custom Service" ? s.customServiceType.trim() : s.serviceType;
        return type && Number(s.price) > 0;
      });
      if (validServices.length === 0)
        return setError("Add at least one service with a valid price."), false;
    }
    if (step === 4) {
      if (verificationPhotos.length === 0)
        return setError("Please upload at least one verification document."), false;
      if (verificationPhotos.length > 2)
        return setError("Maximum 2 verification photos allowed."), false;
      if (workPhotos.length > 10)
        return setError("Maximum 10 work portfolio photos allowed."), false;
    }
    return true;
  }

  function nextStep() {
    if (validateStep()) { setStep(s => s + 1); setError(""); }
  }

  /* ── SUBMIT — Phase 1: Register ── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    // Build servicesOffered
    const servicesOffered = services
      .map(s => ({
        serviceType: s.serviceType === "Custom Service"
          ? s.customServiceType.trim()
          : s.serviceType,
        price: Number(s.price),
      }))
      .filter(s => s.serviceType && s.price > 0);

    try {
      await authApi.tailorRegisterInit({
        name:             form.name,
        shopName:         form.shopName,
        email:            form.email,
        phoneNo:          form.phoneNo,
        password:         form.password,
        age:              Number(form.age),
        gender:           form.gender,
        experience:       Number(form.experience),
        shopAddress:      form.shopAddress,
        verificationType: form.verificationType,
        servicesOffered,
        coordinates: {
          lat: Number(coords.lat),
          lng: Number(coords.lng),
        },
        // Files — if authApi.tailorRegisterInit handles FormData internally:
        verificationPhotos,
        workExperiencePhotos: workPhotos,
      });

      setOtpSent(true);
      setSuccess("OTP sent to your email — check inbox and spam.");
    } catch (err) {
      setError(err.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  }

  /* ── SUBMIT — Phase 2: Verify OTP ── */
  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) return setError("Please enter the 6-digit OTP.");
    setLoading(true);
    setError("");
    try {
      await authApi.tailorRegisterVerify({ email: form.email, code: otpCode });
      setSuccess("Account submitted! You can log in after admin approval.");
      setTimeout(() => navigate("/tailor-login", { replace: true }), 1400);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ══════════════════════════════════════
     OTP SCREEN
     ══════════════════════════════════════ */
  if (otpSent) return (
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
            <p>Check your email inbox and spam folder</p>
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
            {error   && <div className="auth-error">⚠️ {error}</div>}
            {success && <div className="auth-success">✓ {success}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Verifying…" : "Verify & Activate Account →"}
            </button>
            <button type="button" className="ts-back-link" onClick={() => { setOtpSent(false); setSuccess(""); }}>
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

  /* ══════════════════════════════════════
     MAIN 4-STEP FORM
     ══════════════════════════════════════ */
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

        {/* ── LEFT: FORM ── */}
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

          <form
            className="auth-form"
            onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}
          >

            {/* ════ STEP 1 — BASIC INFO ════ */}
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
                    <input name="phoneNo" type="tel" placeholder="9876543210" pattern="\d{10}" value={form.phoneNo} onChange={handleChange} required />
                  </div>
                </div>

                <div className="ts-grid-2">
                  <div className="input-group">
                    <label>Age <span className="ts-required">*</span></label>
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
                  <input name="experience" type="number" min="0" max="60" placeholder="e.g. 8" value={form.experience} onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                </div>
              </>
            )}

            {/* ════ STEP 2 — SHOP DETAILS ════ */}
            {step === 2 && (
              <>
                <div className="input-group">
                  <label>Shop Name <span className="ts-required">*</span></label>
                  <input name="shopName" type="text" placeholder="e.g. Ramesh Tailoring House" value={form.shopName} onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <label>Shop Address <span className="ts-optional">(optional)</span></label>
                  <input name="shopAddress" type="text" placeholder="Street, Area, City" value={form.shopAddress} onChange={handleChange} />
                </div>

                <div className="input-group">
                  <label>Shop GPS Location <span className="ts-required">*</span></label>
                  <div className="ts-location-row">
                    <div className={`ts-location-status ${coords.lat ? "captured" : ""}`}>
                      {coords.lat
                        ? `📍 ${Number(coords.lat).toFixed(4)}, ${Number(coords.lng).toFixed(4)}`
                        : "GPS not captured yet"
                      }
                    </div>
                    <button
                      type="button"
                      className={`ts-gps-btn ${coords.lat ? "captured" : ""}`}
                      onClick={handleGetLocation}
                      disabled={locating}
                    >
                      {locating ? "Locating…" : coords.lat ? "✓ Captured" : "📍 Get GPS"}
                    </button>
                  </div>
                  <p className="ts-field-note">
                    This places you on the nearby tailors map. Must be accurate — customers search by distance.
                  </p>
                </div>

                <div className="input-group">
                  <label>Verification Document Type</label>
                  <select name="verificationType" value={form.verificationType} onChange={handleChange} className="ts-select">
                    <option value="aadharCard">Aadhar Card</option>
                    <option value="voterId">Voter ID</option>
                  </select>
                </div>
              </>
            )}

            {/* ════ STEP 3 — SERVICES ════ */}
            {step === 3 && (
              <>
                <p className="ts-services-intro">
                  Add every service you offer with a starting price. Customers see this on your profile and orders are matched based on these.
                </p>

                <div className="ts-services-list">
                  {services.map((svc, i) => (
                    <div key={i} className="ts-service-row">

                      {/* Service Type */}
                      <div className="input-group ts-service-type">
                        <label>Service {i + 1}</label>
                        <select
                          value={svc.serviceType}
                          onChange={e => updateService(i, "serviceType", e.target.value)}
                          className="ts-select"
                          required
                        >
                          <option value="">Select service</option>
                          {SERVICE_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Custom service name (only when "Custom Service" selected) */}
                      {svc.serviceType === "Custom Service" && (
                        <div className="input-group ts-service-custom">
                          <label>Custom Service Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Designer bridal blouse"
                            value={svc.customServiceType}
                            onChange={e => updateService(i, "customServiceType", e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {/* Price */}
                      <div className="input-group ts-service-price">
                        <label>Starting Price (₹)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="499"
                          value={svc.price}
                          onChange={e => updateService(i, "price", e.target.value)}
                          required
                        />
                      </div>

                      {/* Remove */}
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

            {/* ════ STEP 4 — DOCUMENTS ════ */}
            {step === 4 && (
              <>
                <div className="input-group">
                  <label>
                    Verification Document Photos <span className="ts-required">*</span>
                  </label>
                  <div className="ts-file-upload">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      multiple
                      onChange={e => setVerificationPhotos(Array.from(e.target.files).slice(0, 2))}
                      required
                    />
                    <p className="ts-file-note">Max 2 photos of your {form.verificationType === "aadharCard" ? "Aadhar Card" : "Voter ID"} · JPEG / PNG / WebP</p>
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
                  <label>
                    Work Portfolio Photos <span className="ts-optional">(optional)</span>
                  </label>
                  <div className="ts-file-upload">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      multiple
                      onChange={e => setWorkPhotos(Array.from(e.target.files).slice(0, 10))}
                    />
                    <p className="ts-file-note">Max 10 photos · These appear in your public portfolio on your profile page</p>
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
                  ℹ️ After you submit, our team reviews your documents within <strong>24 hours</strong>. You'll be notified by email when your profile goes live.
                </div>
              </>
            )}

            {/* ERROR / SUCCESS */}
            {error   && <div className="auth-error">⚠️ {error}</div>}
            {success && <div className="auth-success">✓ {success}</div>}

            {/* NAVIGATION BUTTONS */}
            <div className="ts-btn-row">
              {step > 1 && (
                <button
                  type="button"
                  className="ts-back-btn"
                  onClick={() => { setStep(s => s - 1); setError(""); }}
                >
                  ← Back
                </button>
              )}
              <button
                className="auth-btn ts-next-btn"
                type="submit"
                disabled={loading}
              >
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

        {/* ── RIGHT: VIDEO ── */}
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
              <div className="tailor-perk">✓ No commission for first 3 months</div>
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