import React from 'react';
import '../styles/tailorGrid.css';

const tailors = [
  { id: 1, name: "Master Rajesh Kumar", specialty: "Sherwani & Wedding Expert", rating: "4.9", orders: "520+", image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Saira Bano", specialty: "Blouse & Boutique Specialist", rating: "4.8", orders: "310+", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Arjun Singh", specialty: "Suits & Formal Wear", rating: "5.0", orders: "180+", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" }
];

function TailorGrid() {
  return (
<section className="tailor-grid glow-bg">
  <div className="max-w">
    <div className="section-intro">
      <h2 className="text2">Curated Artisans</h2>
      <h1 className="text1">Verified <span className="text-capsule">Masters.</span></h1>
    </div>

    <div className="editorial-grid">
      {tailors.map((tailor, index) => (
        <div key={tailor.id} className={`tailor-item item-${index}`}>
          <div className="image-wrapper">
            <img src={tailor.image} alt={tailor.name} />
            <div className="floating-tag text5">Top Rated</div>
          </div>
          
          <div className="item-details">
            <div className="details-header">
              <h3 className="text4">{tailor.name}</h3>
              <span className="text6">★ {tailor.rating}</span>
            </div>
            <p className="text3">{tailor.specialty}</p>
            <button className="editorial-btn">
               <span className="text5">Book Visit</span>
               <div className="btn-circle">→</div>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}

export default TailorGrid;