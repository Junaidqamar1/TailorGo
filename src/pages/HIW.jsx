import React from "react";
import "../styles/hiw.css";

function HIW() {
  return (
    <section className="hiw">
      <div className="hiw-container">

        <p className="section-tag">Simple Process</p>
        <h2 className="section-title">How It Works</h2>

        <div className="stack">

          <div className="card card-1">
            <div className="card-inner">
              <span className="step-no">01</span>
              <h3>Post Your Requirement</h3>
              <p>Tell us what you want stitched or upload a design.</p>
            </div>
          </div>

          <div className="card card-2">
            <div className="card-inner">
              <span className="step-no">02</span>
              <h3>Get Offers</h3>
              <p>Nearby tailors send quotes, pricing & timelines.</p>
            </div>
          </div>

          <div className="card card-3">
            <div className="card-inner">
              <span className="step-no">03</span>
              <h3>Choose & Relax</h3>
              <p>Pick the best tailor and enjoy doorstep service.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HIW;