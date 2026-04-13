import React from 'react';
import '../styles/tailors.css';

const tailors = [
  { id: 1, name: "Master Ibrahim", exp: "22 Yrs Exp", rating: "4.9", tags: ["Sherwani", "Suits"], img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400" },
  { id: 2, name: "Master Savita", exp: "15 Yrs Exp", rating: "4.8", tags: ["Lehenga", "Blouse"], img: "https://images.unsplash.com/photo-1621184414184-0155f0ce1447?q=80&w=400" },
  { id: 3, name: "Master Rahil", exp: "12 Yrs Exp", rating: "5.0", tags: ["Kurta", "Pathani"], img: "https://images.unsplash.com/photo-1617137968427-83c394297940?q=80&w=400" },
];

function TailorSection() {
  return (
    <section className="tailor-wrapper max-w">
      <div className="tailor-header">
        <h2 className="text2">Curated for you</h2>
        <h1 className="text1">Master Tailors <span className="text-capsule-blue">Nearby</span></h1>
      </div>

      <div className="tailor-grid">
        {tailors.map(t => (
          <div key={t.id} className="master-card">
            <div className="card-top">
              <img src={t.img} alt={t.name} className="master-img" />
              <div className="card-overlay">
                <span className="badge-exp text6">{t.exp}</span>
              </div>
            </div>
            
            <div className="card-body">
              <div className="card-title-row">
                <h3 className="text4">{t.name}</h3>
                <div className="rating-tag"><span className="star">✦</span> {t.rating}</div>
              </div>
              
              <div className="tag-container">
                {t.tags.map(tag => <span key={tag} className="skill-tag text6">{tag}</span>)}
              </div>

              <button className="book-btn">
                <span className="text5">Book Appointment</span>
                <div className="btn-icon">→</div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TailorSection;