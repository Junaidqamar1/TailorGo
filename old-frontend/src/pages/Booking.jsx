import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/booking.css";

/* ─────────────────────────────── CONSTANTS ── */
const GARMENT_TYPES = [
  { id: "shirt",     icon: "👔", name: "Shirt",         desc: "Formal & casual" },
  { id: "trouser",   icon: "👖", name: "Trouser",        desc: "All styles" },
  { id: "suit",      icon: "🤵", name: "Suit",           desc: "2 or 3 piece" },
  { id: "sherwani",  icon: "🥻", name: "Sherwani",       desc: "Wedding & ceremonial" },
  { id: "kurta",     icon: "👕", name: "Kurta",          desc: "Casual & festive" },
  { id: "blouse",    icon: "👗", name: "Blouse",         desc: "Saree & lehenga" },
  { id: "lehenga",   icon: "👘", name: "Lehenga",        desc: "Bridal & festive" },
  { id: "bandhgala", icon: "🎽", name: "Bandhgala",      desc: "Indo-formal" },
  { id: "other",     icon: "✂️", name: "Other",          desc: "Describe below" },
];

const FABRIC_TYPES = ["cotton", "silk", "linen", "polyester", "wool", "georgette", "chiffon", "velvet", "other"];
const FABRIC_COLORS = ["white", "black", "navy", "maroon", "beige", "grey", "green", "blue", "red", "yellow", "pink", "custom"];

const STEPS = [
  { num: 1, label: "Garment" },
  { num: 2, label: "Fabric" },
  { num: 3, label: "Measurements" },
  { num: 4, label: "Delivery" },
  { num: 5, label: "Confirm" },
];

/* ─────────────────────────────── COMPONENT ── */
export default function Booking() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const tailorUsername = searchParams.get("tailor"); // optional — if coming from tailor profile

  const [step, setStep]   = useState(1);
  const [done, setDone]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });

  /* ── FORM STATE ── */
  const [garmentType,         setGarmentType]         = useState("");
  const [fabricType,          setFabricType]           = useState("cotton");
  const [fabricColor,         setFabricColor]          = useState("white");
  const [fabricProvidedBy,    setFabricProvidedBy]     = useState("customer");
  const [customerNote,        setCustomerNote]         = useState("");
  const [measurementPref,     setMeasurementPref]      = useState("tailor_visit");
  const [measurements,        setMeasurements]         = useState({ unit: "inch", chest: "", waist: "", shoulder: "", hip: "", length: "" });
  const [measurementImage,    setMeasurementImage]     = useState(null);
  const [referenceImages,     setReferenceImages]      = useState([]);
  const [deliveryMethod,      setDeliveryMethod]       = useState("tailor_pickup");
  const [deliveryAddress,     setDeliveryAddress]      = useState({ line1: "", line2: "", landmark: "", city: "", state: "", pincode: "" });

  /* ── GET LOCATION ON MOUNT ── */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => setError("Location access denied. Please enable GPS for accurate tailor matching.")
    );
  }, []);

  /* ── VALIDATION ── */
  function validate() {
    setError("");
    if (step === 1 && !garmentType) return setError("Please select a garment type."), false;
    if (step === 3 && measurementPref === "measurement_image" && !measurementImage)
      return setError("Please upload your measurement image."), false;
    if (step === 3 && measurementPref === "manual_values") {
      if (!measurements.chest || !measurements.waist || !measurements.shoulder)
        return setError("Please fill chest, waist and shoulder measurements."), false;
    }
    if (step === 4) {
      if (!deliveryAddress.line1 || !deliveryAddress.city || !deliveryAddress.pincode)
        return setError("Please fill address, city and pincode."), false;
      if (!/^\d{6}$/.test(deliveryAddress.pincode))
        return setError("Pincode must be 6 digits."), false;
      if (!coords.lat)
        return setError("Location access required for nearby tailor matching. Please enable GPS."), false;
    }
    return true;
  }

  function next() { if (validate()) setStep(s => s + 1); }
  function back() { setStep(s => s - 1); setError(""); }

  /* ── SUBMIT ── */
  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("garmentType",        garmentType);
    fd.append("fabricType",         fabricType);
    fd.append("fabricColor",        fabricColor);
    fd.append("fabricProvidedBy",   fabricProvidedBy);
    fd.append("measurementPreference", measurementPref);
    fd.append("deliveryMethod",     deliveryMethod);
    fd.append("coordinates[lat]",   coords.lat);
    fd.append("coordinates[lng]",   coords.lng);
    if (customerNote) fd.append("customerNote", customerNote);

    // Delivery address
    Object.entries(deliveryAddress).forEach(([k, v]) => {
      if (v) fd.append(`deliveryAddress[${k}]`, v);
    });

    // Measurements
    if (measurementPref === "manual_values") {
      fd.append("measurements[unit]",     measurements.unit);
      fd.append("measurements[chest]",    measurements.chest);
      fd.append("measurements[waist]",    measurements.waist);
      fd.append("measurements[shoulder]", measurements.shoulder);
      if (measurements.hip)    fd.append("measurements[hip]",    measurements.hip);
      if (measurements.length) fd.append("measurements[length]", measurements.length);
    }

    // Files
    if (measurementPref === "measurement_image" && measurementImage)
      fd.append("measurementImage", measurementImage);
    referenceImages.forEach(f => fd.append("referenceImages", f));

    try {
      const res  = await fetch("http://localhost:5000/api/v1/booking/orders", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
      } else {
        setError(data.message || "Could not place order. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const selectedGarment = GARMENT_TYPES.find(g => g.id === garmentType);

  /* ═══════════════ SUCCESS SCREEN ═══════════════ */
  if (done) return (
    <div className="bp-page">
      <div className="bp-success-wrap">
        <div className="bp-success-card">
          <div className="bp-success-icon">✓</div>
          <h2 className="bp-success-title">Order Placed!</h2>
          <p className="bp-success-sub">
            Your order has been <strong>broadcasted to nearby tailors</strong>. You'll get notified when a tailor accepts.
          </p>
          <div className="bp-success-details">
            <div className="bp-sd-row"><span>Garment</span><strong>{selectedGarment?.icon} {selectedGarment?.name}</strong></div>
            <div className="bp-sd-row"><span>Fabric</span><strong>{fabricType} · {fabricColor}</strong></div>
            <div className="bp-sd-row"><span>Fabric by</span><strong>{fabricProvidedBy === "customer" ? "You (Customer)" : "Tailor arranges"}</strong></div>
            <div className="bp-sd-row"><span>Measurements</span><strong>
              {measurementPref === "tailor_visit" ? "Tailor will visit" : measurementPref === "manual_values" ? "Manual values sent" : "Image uploaded"}
            </strong></div>
            <div className="bp-sd-row"><span>Delivery to</span><strong>{deliveryAddress.city}, {deliveryAddress.pincode}</strong></div>
          </div>
          <div className="bp-whatsapp-note">📱 You'll receive a WhatsApp notification when a tailor accepts</div>
          <div className="bp-success-actions">
            <button className="bp-btn-primary"  onClick={() => navigate("/")}>Back to Home</button>
            <button className="bp-btn-outline"  onClick={() => navigate("/dashboard")}>View My Orders</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══════════════ MAIN FLOW ═══════════════ */
  return (
    <div className="bp-page">

      {/* TOP BAR */}
      <div className="bp-topbar">
        <button className="bp-back-link" onClick={() => step > 1 ? back() : navigate(-1)}>
          ← {step > 1 ? "Back" : "Back"}
        </button>
        <div className="bp-topbar-title">Place Order</div>
        <div className="bp-topbar-step">Step {step} of {STEPS.length}</div>
      </div>

      <div className="bp-layout">
        <div className="bp-main">

          {/* STEP PROGRESS */}
          <div className="bp-progress">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`bp-step ${step === s.num ? "active" : ""} ${step > s.num ? "done" : ""}`}>
                  <div className="bp-step-circle">{step > s.num ? "✓" : s.num}</div>
                  <span className="bp-step-label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`bp-step-connector ${step > s.num ? "done" : ""}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* ══ STEP 1 — GARMENT ══ */}
          {step === 1 && (
            <div className="bp-card">
              <div className="bp-card-header">
                <h2>What would you like stitched?</h2>
                <p>Select the garment type for your order</p>
              </div>
              <div className="bp-outfit-grid">
                {GARMENT_TYPES.map(g => (
                  <div key={g.id} className={`bp-outfit-item ${garmentType === g.id ? "selected" : ""}`} onClick={() => setGarmentType(g.id)}>
                    {garmentType === g.id && <div className="bp-outfit-check">✓</div>}
                    <div className="bp-outfit-icon">{g.icon}</div>
                    <div className="bp-outfit-name">{g.name}</div>
                    <div className="bp-outfit-desc">{g.desc}</div>
                  </div>
                ))}
              </div>
              <div className="bp-field">
                <label>Additional notes <span className="bp-optional">optional</span></label>
                <textarea className="bp-textarea" rows={3} placeholder="e.g. Slim fit, specific design, event date…" value={customerNote} onChange={e => setCustomerNote(e.target.value)} />
              </div>
              {error && <div className="bp-error">⚠️ {error}</div>}
              <div className="bp-step-footer">
                <button className="bp-btn-primary" disabled={!garmentType} onClick={next}>Continue → Fabric Details</button>
              </div>
            </div>
          )}

          {/* ══ STEP 2 — FABRIC ══ */}
          {step === 2 && (
            <div className="bp-card">
              <div className="bp-card-header">
                <h2>Fabric Details</h2>
                <p>Tell us about the fabric for your {selectedGarment?.name}</p>
              </div>

              <div className="bp-field">
                <label>Fabric Type</label>
                <div className="bp-chip-grid">
                  {FABRIC_TYPES.map(f => (
                    <div key={f} className={`bp-chip-item ${fabricType === f ? "selected" : ""}`} onClick={() => setFabricType(f)}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bp-field">
                <label>Fabric Color</label>
                <div className="bp-chip-grid">
                  {FABRIC_COLORS.map(c => (
                    <div key={c} className={`bp-chip-item ${fabricColor === c ? "selected" : ""}`} onClick={() => setFabricColor(c)}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bp-field">
                <label>Who provides the fabric?</label>
                <div className="bp-radio-group">
                  <div className={`bp-radio-item ${fabricProvidedBy === "customer" ? "selected" : ""}`} onClick={() => setFabricProvidedBy("customer")}>
                    <div className="bp-radio-dot" />
                    <div>
                      <div className="bp-radio-title">I'll provide the fabric</div>
                      <div className="bp-radio-sub">You bring fabric during the home visit</div>
                    </div>
                  </div>
                  <div className={`bp-radio-item ${fabricProvidedBy === "tailor" ? "selected" : ""}`} onClick={() => setFabricProvidedBy("tailor")}>
                    <div className="bp-radio-dot" />
                    <div>
                      <div className="bp-radio-title">Tailor arranges fabric</div>
                      <div className="bp-radio-sub">Tailor sources fabric — cost added to final price</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bp-field">
                <label>Reference Images <span className="bp-optional">optional · max 5</span></label>
                <div className="bp-file-box">
                  <input type="file" accept="image/*" multiple onChange={e => setReferenceImages(Array.from(e.target.files).slice(0, 5))} />
                  <p className="bp-file-note">Upload design inspiration or reference photos</p>
                </div>
                {referenceImages.length > 0 && (
                  <div className="bp-file-chips">
                    {referenceImages.map((f, i) => <span key={i} className="bp-file-chip">🖼️ {f.name}</span>)}
                  </div>
                )}
              </div>

              {error && <div className="bp-error">⚠️ {error}</div>}
              <div className="bp-step-footer">
                <button className="bp-btn-outline" onClick={back}>← Back</button>
                <button className="bp-btn-primary" onClick={next}>Continue → Measurements</button>
              </div>
            </div>
          )}

          {/* ══ STEP 3 — MEASUREMENTS ══ */}
          {step === 3 && (
            <div className="bp-card">
              <div className="bp-card-header">
                <h2>Measurements</h2>
                <p>How would you like measurements to be taken?</p>
              </div>

              <div className="bp-radio-group" style={{ marginBottom: 24 }}>
                <div className={`bp-radio-item ${measurementPref === "tailor_visit" ? "selected" : ""}`} onClick={() => setMeasurementPref("tailor_visit")}>
                  <div className="bp-radio-dot" />
                  <div>
                    <div className="bp-radio-title">🏠 Tailor visits for measurements</div>
                    <div className="bp-radio-sub">Recommended — tailor comes to your door, most accurate</div>
                  </div>
                </div>
                <div className={`bp-radio-item ${measurementPref === "measurement_image" ? "selected" : ""}`} onClick={() => setMeasurementPref("measurement_image")}>
                  <div className="bp-radio-dot" />
                  <div>
                    <div className="bp-radio-title">📸 Upload measurement image</div>
                    <div className="bp-radio-sub">Send a photo of your measurement chart</div>
                  </div>
                </div>
                <div className={`bp-radio-item ${measurementPref === "manual_values" ? "selected" : ""}`} onClick={() => setMeasurementPref("manual_values")}>
                  <div className="bp-radio-dot" />
                  <div>
                    <div className="bp-radio-title">📏 Enter measurements manually</div>
                    <div className="bp-radio-sub">Input your own measurements in inches</div>
                  </div>
                </div>
              </div>

              {/* Upload image */}
              {measurementPref === "measurement_image" && (
                <div className="bp-field">
                  <label>Measurement Image <span className="bp-required">*</span></label>
                  <div className="bp-file-box">
                    <input type="file" accept="image/*" onChange={e => setMeasurementImage(e.target.files[0] || null)} />
                  </div>
                  {measurementImage && <div className="bp-file-chips"><span className="bp-file-chip">📄 {measurementImage.name}</span></div>}
                </div>
              )}

              {/* Manual values */}
              {measurementPref === "manual_values" && (
                <div className="bp-measurements-grid">
                  <div className="bp-field">
                    <label>Unit</label>
                    <select className="bp-select" value={measurements.unit} onChange={e => setMeasurements({ ...measurements, unit: e.target.value })}>
                      <option value="inch">Inch</option>
                      <option value="cm">Centimeter</option>
                    </select>
                  </div>
                  {[
                    { key: "chest",    label: "Chest *",    ph: "40" },
                    { key: "waist",    label: "Waist *",    ph: "34" },
                    { key: "shoulder", label: "Shoulder *", ph: "18" },
                    { key: "hip",      label: "Hip",        ph: "38" },
                    { key: "length",   label: "Length",     ph: "28" },
                  ].map(m => (
                    <div key={m.key} className="bp-field">
                      <label>{m.label}</label>
                      <input type="number" className="bp-input" placeholder={m.ph} value={measurements[m.key]} onChange={e => setMeasurements({ ...measurements, [m.key]: e.target.value })} />
                    </div>
                  ))}
                </div>
              )}

              {error && <div className="bp-error">⚠️ {error}</div>}
              <div className="bp-step-footer">
                <button className="bp-btn-outline" onClick={back}>← Back</button>
                <button className="bp-btn-primary" onClick={next}>Continue → Delivery</button>
              </div>
            </div>
          )}

          {/* ══ STEP 4 — DELIVERY ══ */}
          {step === 4 && (
            <div className="bp-card">
              <div className="bp-card-header">
                <h2>Delivery Details</h2>
                <p>Where should we deliver your finished outfit?</p>
              </div>

              <div className="bp-field">
                <label>Delivery Method</label>
                <div className="bp-radio-group">
                  <div className={`bp-radio-item ${deliveryMethod === "tailor_pickup" ? "selected" : ""}`} onClick={() => setDeliveryMethod("tailor_pickup")}>
                    <div className="bp-radio-dot" />
                    <div>
                      <div className="bp-radio-title">🚚 Tailor delivers to your address</div>
                      <div className="bp-radio-sub">Outfit brought to your door when ready</div>
                    </div>
                  </div>
                  <div className={`bp-radio-item ${deliveryMethod === "customer_pickup" ? "selected" : ""}`} onClick={() => setDeliveryMethod("customer_pickup")}>
                    <div className="bp-radio-dot" />
                    <div>
                      <div className="bp-radio-title">🏪 I'll pick up from the shop</div>
                      <div className="bp-radio-sub">Collect from the tailor's shop directly</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bp-address-grid">
                <div className="bp-field bp-field-full">
                  <label>Address Line 1 <span className="bp-required">*</span></label>
                  <input className="bp-input" placeholder="House/Flat no., Building name" value={deliveryAddress.line1} onChange={e => setDeliveryAddress({ ...deliveryAddress, line1: e.target.value })} />
                </div>
                <div className="bp-field bp-field-full">
                  <label>Address Line 2 <span className="bp-optional">optional</span></label>
                  <input className="bp-input" placeholder="Street, Area" value={deliveryAddress.line2} onChange={e => setDeliveryAddress({ ...deliveryAddress, line2: e.target.value })} />
                </div>
                <div className="bp-field bp-field-full">
                  <label>Landmark <span className="bp-optional">optional</span></label>
                  <input className="bp-input" placeholder="e.g. Near Metro gate" value={deliveryAddress.landmark} onChange={e => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })} />
                </div>
                <div className="bp-field">
                  <label>City <span className="bp-required">*</span></label>
                  <input className="bp-input" placeholder="Mumbai" value={deliveryAddress.city} onChange={e => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })} />
                </div>
                <div className="bp-field">
                  <label>State</label>
                  <input className="bp-input" placeholder="Maharashtra" value={deliveryAddress.state} onChange={e => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })} />
                </div>
                <div className="bp-field">
                  <label>Pincode <span className="bp-required">*</span></label>
                  <input className="bp-input" placeholder="400001" maxLength={6} value={deliveryAddress.pincode} onChange={e => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })} />
                </div>
              </div>

              <div className={`bp-location-status ${coords.lat ? "ok" : "warn"}`}>
                {coords.lat ? `📍 Location captured · ${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}` : "⚠️ Location not captured — enable GPS for tailor matching"}
              </div>

              {error && <div className="bp-error">⚠️ {error}</div>}
              <div className="bp-step-footer">
                <button className="bp-btn-outline" onClick={back}>← Back</button>
                <button className="bp-btn-primary" onClick={next}>Continue → Review</button>
              </div>
            </div>
          )}

          {/* ══ STEP 5 — CONFIRM ══ */}
          {step === 5 && (
            <div className="bp-card">
              <div className="bp-card-header">
                <h2>Review & Place Order</h2>
                <p>Your order will be broadcast to nearby tailors instantly</p>
              </div>

              <div className="bp-review-block">
                <div className="bp-review-label">Garment</div>
                <div className="bp-review-val bp-review-outfit">
                  <span>{selectedGarment?.icon}</span>
                  <div><strong>{selectedGarment?.name}</strong><span>{selectedGarment?.desc}</span></div>
                </div>
              </div>

              <div className="bp-review-grid">
                <div className="bp-review-block">
                  <div className="bp-review-label">Fabric</div>
                  <div className="bp-review-val">{fabricType} · {fabricColor}</div>
                </div>
                <div className="bp-review-block">
                  <div className="bp-review-label">Fabric by</div>
                  <div className="bp-review-val">{fabricProvidedBy === "customer" ? "You" : "Tailor"}</div>
                </div>
                <div className="bp-review-block">
                  <div className="bp-review-label">Measurements</div>
                  <div className="bp-review-val">
                    {measurementPref === "tailor_visit" ? "Tailor visit" : measurementPref === "manual_values" ? "Manual values" : "Image uploaded"}
                  </div>
                </div>
                <div className="bp-review-block">
                  <div className="bp-review-label">Delivery</div>
                  <div className="bp-review-val">{deliveryMethod === "tailor_pickup" ? "To my address" : "Shop pickup"}</div>
                </div>
              </div>

              <div className="bp-review-block">
                <div className="bp-review-label">Delivery Address</div>
                <div className="bp-review-val">{deliveryAddress.line1}, {deliveryAddress.city} — {deliveryAddress.pincode}</div>
              </div>

              {customerNote && (
                <div className="bp-review-block">
                  <div className="bp-review-label">Your Note</div>
                  <div className="bp-review-val">{customerNote}</div>
                </div>
              )}

              <div className="bp-broadcast-notice">
                📡 Your order will be <strong>broadcast to all nearby tailors</strong> who offer {selectedGarment?.name} stitching. The first available tailor accepts and contacts you.
              </div>

              {error && <div className="bp-error">⚠️ {error}</div>}
              <div className="bp-step-footer">
                <button className="bp-btn-outline" onClick={back} disabled={loading}>← Back</button>
                <button className="bp-btn-primary bp-btn-confirm" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Placing Order…" : "Place Order →"}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── SIDEBAR ── */}
        <div className="bp-sidebar">
          <div className="bp-tailor-card">
            <div className="bp-tc-header">How this works</div>
            <div className="bp-how-steps">
              <div className="bp-how-step"><span className="bp-how-num">1</span><span>You place your order with garment details</span></div>
              <div className="bp-how-step"><span className="bp-how-num">2</span><span>Order broadcasts to nearby verified tailors</span></div>
              <div className="bp-how-step"><span className="bp-how-num">3</span><span>A tailor accepts and contacts you</span></div>
              <div className="bp-how-step"><span className="bp-how-num">4</span><span>Home visit for measurements (if selected)</span></div>
              <div className="bp-how-step"><span className="bp-how-num">5</span><span>Outfit delivered to your door 🎉</span></div>
            </div>
          </div>

          <div className="bp-trust-card">
            <div className="bp-trust-item">🔒 All tailors are verified</div>
            <div className="bp-trust-item">📡 Order sent to 15+ nearby tailors</div>
            <div className="bp-trust-item">📐 Precise measurements guaranteed</div>
            <div className="bp-trust-item">🚚 Delivery in 48–72 hrs</div>
            <div className="bp-trust-item">↩️ Free alterations if fit is off</div>
          </div>
        </div>

      </div>
    </div>
  );
}