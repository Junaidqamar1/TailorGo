import React from 'react';
import "../styles/find-tailors.css";

const tailors = [
  { id: 1, name: "Ibrahim Khalil", specialty: "Bespoke Suits", rating: 4.9, orders: 1200, price: "$$$", location: "2.4km", image: "tailor1.jpg" },
  { id: 2, name: "Sara's Atelier", specialty: "Bridal & Ethnic", rating: 4.8, orders: 850, price: "$$$$", location: "1.1km", image: "tailor2.jpg" },
  { id: 3, name: "Marcus Vane", specialty: "Casual & Chinos", rating: 4.7, orders: 430, price: "$$", location: "3.2km", image: "tailor3.jpg" },
  // Add more as needed
];

const FindTailors = () => {
  return (
    <div className="find-page">
      {/* 1. TOP DENSITY BAR - Quick Stats */}
      <div className="discovery-header">
        <div className="max-w flex-between">
          <h1 className="text2">Found <span className="blue-glow-text">24 Masters</span> Near You</h1>
          <div className="view-toggle">
            <button className="toggle-btn active">Grid</button>
            <button className="toggle-btn">Map View</button>
          </div>
        </div>
      </div>

      <div className="max-w main-discovery-grid">
        
        {/* 2. PERSISTENT FILTER SIDEBAR (Fills the 'Empty' Left) */}
        <aside className="filter-sidebar glass-card">
          <div className="filter-group">
            <h4 className="text6">Garment Type</h4>
            <div className="check-item"><input type="checkbox" /> <span>3-Piece Suits</span></div>
            <div className="check-item"><input type="checkbox" /> <span>Ethnic Wear</span></div>
            <div className="check-item"><input type="checkbox" /> <span>Formal Shirts</span></div>
          </div>

          <div className="filter-group">
            <h4 className="text6">Price Range</h4>
            <div className="price-slider-mock">
               <div className="slider-track"></div>
               <div className="slider-knob left"></div>
               <div className="slider-knob right"></div>
            </div>
          </div>

          <div className="filter-group">
            <h4 className="text6">Master Level</h4>
            <div className="check-item"><input type="checkbox" /> <span>Expert (10+ yrs)</span></div>
            <div className="check-item"><input type="checkbox" /> <span>Verified Only</span></div>
          </div>

          <button className="apply-filter-btn">Refine Search</button>
        </aside>

        {/* 3. TAILOR RESULTS GRID */}
        <main className="results-container">
          <div className="tailor-results-grid">
            {tailors.map(tailor => (
              <div key={tailor.id} className="tailor-master-card glass-white">
                <div className="card-image-wrapper">
                  <img src={tailor.image} alt={tailor.name} />
                  <span className="dist-tag">{tailor.location}</span>
                </div>
                
                <div className="card-details">
                  <div className="card-top-row">
                    <span className="specialty-pill">{tailor.specialty}</span>
                    <span className="rating-tag">★ {tailor.rating}</span>
                  </div>
                  <h3 className="text4">{tailor.name}</h3>
                  <p className="text6 muted">{tailor.orders}+ Successful Fits</p>
                  
                  <div className="card-bottom-row">
                    <span className="price-indicator">{tailor.price}</span>
                    <button className="view-profile-cta">View Portfolio</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
};

export default FindTailors;