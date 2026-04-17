import React from 'react';
import '../styles/tailors.css';

const tailors = [
  { id: 1, name: "Master Ibrahim", exp: "22 Yrs Exp", rating: "4.9", tags: ["Sherwani", "Suits"], img: "https://plus.unsplash.com/premium_photo-1683140721927-aaed410fae29?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, name: "Master Savita", exp: "15 Yrs Exp", rating: "4.8", tags: ["Lehenga", "Blouse"], img: "https://plus.unsplash.com/premium_photo-1683129663272-6a157e9c493c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, name: "Master Rahil", exp: "12 Yrs Exp", rating: "5.0", tags: ["Kurta", "Pathani"], img: "https://plus.unsplash.com/premium_photo-1663047237571-fec4456a40a2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

function TailorSection() {
  return (
    <section className="tailor-wrapper max-w">
      <div className="tailor-header">
        <h2 className="text2 f-22">Curated for you</h2>
        <h3 className="text1 f-28">Master Tailors <span className="text-capsule-blue">Nearby</span></h3>
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