import React, { useState } from "react";
import "../styles/booking.css";

function Booking() {
  const [service, setService] = useState("Suit");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <section className="booking-page">

      <div className="booking-container">

        {/* LEFT — FORM */}
        <div className="booking-form">

          <h2 className="booking-title">
            Book Your <span>Appointment</span>
          </h2>

          <div className="form-group">
            <label>Choose Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)}>
              <option>Suit</option>
              <option>Shirt</option>
              <option>Sherwani</option>
              <option>Trousers</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Select Time</label>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea placeholder="Enter your address..." />
          </div>

          <button className="booking-btn">
            Confirm Booking →
          </button>

        </div>

        {/* RIGHT — SUMMARY */}
        <div className="booking-summary">

          <h3>Booking Summary</h3>

          <div className="summary-item">
            <span>Service</span>
            <b>{service}</b>
          </div>

          <div className="summary-item">
            <span>Date</span>
            <b>{date || "—"}</b>
          </div>

          <div className="summary-item">
            <span>Time</span>
            <b>{time || "—"}</b>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <b>$49</b>
          </div>

          <p className="summary-note">
            ✔ Professional measurement included <br/>
            ✔ 100% fit guarantee
          </p>

        </div>

      </div>

    </section>
  );
}

export default Booking;