import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import img1 from "../assets/img1.png";
import img3 from "../assets/img3.png";
import tshirt from "../assets/tshirt.png";
import shirt from "../assets/shirt.png";
import kurta from "../assets/kurta.png";

const OUTFITS = ["Sherwani", "Suit", "Kurta", "Blouse", "Shirt", "Alteration"];

function Hero() {
  const navigate  = useNavigate();
  const [outfit, setOutfit]   = useState("");
  const [locating, setLocating] = useState(false);
  const [locDone, setLocDone]   = useState(false);
  const [coords, setCoords]     = useState(null);

  function handleLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        setLocDone(true);
      },
      () => setLocating(false),
      { timeout: 6000 }
    );
  }

  function handlePlaceOrder() {
    // Pass outfit selection to booking page via query param
    const query = outfit ? `?garment=${outfit.toLowerCase()}` : "";
    navigate(`/booking${query}`);
  }

  function handleBrowseTailors() {
    navigate("/find-tailors");
  }

  return (
    <section className="hero">
      <div className="bg-img"><img src={img1} alt="" /></div>
      <div className="bg-img2"><img src={img3} alt="" /></div>

      <div className="hero-container">
        <div className="hero-content">

          <p className="text2 f-22">The Modern Atelier</p>

          <h1 className="head-text">
            Master Tailors. <br />
            At Your <span className="text-capsule">Doorstep.</span>
          </h1>

          <p className="text3">
            The first on-demand marketplace for bespoke Indian wear. Find a nearby tailor,
            book a home visit, and get perfectly fitted in 48 hours.
          </p>

          {/* ── SEARCH BAR ── */}
          {/* <div className="action-bar">

  
            <button
              type="button"
              className="hero-location-btn"
              onClick={handleLocation}
              disabled={locating}
            >
              <span className="icon">
                {locating ? "⏳" : locDone ? "✅" : "📍"}
              </span>
              <span className="hero-loc-text">
                {locating ? "Finding…" : locDone ? "Location set" : "Use my location"}
              </span>
            </button>

            <div className="divider" />

   
            <div className="hero-outfit-wrap">
              <span className="icon">✂️</span>
              <select
                value={outfit}
                onChange={e => setOutfit(e.target.value)}
                className="hero-outfit-select"
              >
                <option value="">Select Outfit</option>
                {OUTFITS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>


            <button
              className="btn-primary-hero text5"
              type="button"
              onClick={handlePlaceOrder}
            >
              Place an Order
            </button>

          </div> */}


          <div className="hero-cta-row">
            <button
              className="hero-cta-primary"
              onClick={handlePlaceOrder}
            >
              🪡 Place an Order
            </button>
            <button
              className="hero-cta-secondary"
              onClick={handleBrowseTailors}
            >
              Browse Tailors →
            </button>
          </div>

          {/* TRUST LINE */}
          <div className="hero-trust-line">
            <p className="text3">
              <span className="creative-badge">500+</span> Verified Masters,
              Starts at <span className="creative-price">₹299</span>.
              Book your tailor <span className="creative-now">now.</span>
            </p>
          </div>

        </div>
      </div>

      {/* STITCHING COLLECTION */}
      <section className="atelier-collection">
        <h3 className="text1 f-28">
          What Are We <span className="text-capsule-blue">Stitching</span> Today
        </h3>
        <div className="product-grid">
          {[
            { img: tshirt, label: "Bespoke Kurta" },
            { img: kurta,  label: "Master Kurta"  },
            { img: shirt,  label: "Custom Shirt"  },
          ].map(item => (
            <div
              key={item.label}
              className="product-card"
              onClick={handlePlaceOrder}
              style={{ cursor: "pointer" }}
            >
              <div className="icon-box"><img src={item.img} alt={item.label} /></div>
              <p className="item-name">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

    </section>
  );
}

export default Hero;