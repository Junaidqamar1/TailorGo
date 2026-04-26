import React from 'react';
import '../styles/TailorProfile.css';
;

const tailorServices = [
    { id: 1, name: '2-Piece Bespoke Suit', price: '$120', time: '7-10 Days', image: '/suit-icon.jpg' },
    { id: 2, name: 'Formal Cotton Shirt', price: '$35', time: '3-5 Days', image: '/shirt-icon.jpg' },
    { id: 3, name: 'Traditional Sherwani', price: '$150', time: '14 Days', image: '/sherwani.jpg' },
    { id: 4, name: 'Trousers/Chinos', price: '$25', time: '3 Days', image: '/pant.jpg' },
];

const TailorProfile = () => {
    return (
        <div className="profile-page-v2 bg-beige">
            <div className="max-w container-split">

                {/* DATA COLUMN (Left) */}
                <div className="data-column">
                    {/* 1. IDENTITY HEADER */}
                    <section className="identity-card glass">
                        <div className="id-top">
                            <img src="/tailor-photo.jpg" className="pro-avatar" alt="Master" />
                            <div className="id-info">
                                <div className="badge-row">
                                    <span className="pill-blue">Verified Master</span>
                                    <span className="pill-location">📍 Manhattan, NY</span>
                                </div>
                                <h1 className="text1">Ibrahim Khalil</h1>
                                <p className="text3">“Crafting perfection, one stitch at a time.”</p>
                            </div>
                        </div>
                        <div className="id-stats">
                            <div className="stat-block"><p className="text6">Experience</p><b>22 Years</b></div>
                            <div className="stat-block"><p className="text6">Orders</p><b>1.2k+</b></div>
                            <div className="stat-block"><p className="text6">Avg. Rating</p><b>4.9 ⭐</b></div>
                        </div>
                    </section>

                    {/* 2. THE SERVICE MENU (The "Useless-to-Useful" Fix) */}
                    <section className="service-menu">
                        <h2 className="text4">Services & Transparent Pricing</h2>
                        <div className="service-grid">
                            {tailorServices.map(service => (
                                <div key={service.id} className="service-item glass-white">
                                    <div className="service-img-mini"></div>
                                    <div className="service-details">
                                        <h4>{service.name}</h4>
                                        <p className="text6">Delivery: {service.time}</p>
                                        <div className="price-row">
                                            <span>Starts from <b>{service.price}</b></span>
                                            <button className="add-btn">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. REVIEWS SECTION */}
                    <section className="reviews-hub">
                        <h2 className="text4">What Clients Say</h2>
                        <div className="review-pill glass-white">
                            <div className="rev-top">
                                <b>Sara J.</b> <span className="stars">⭐⭐⭐⭐⭐</span>
                            </div>
                            <p className="text3">"The doorstep measurement was so professional. My wedding suit fits like a second skin."</p>
                        </div>
                    </section>
                </div>

                {/* STICKY CTA COLUMN (Right) */}
                <aside className="sticky-cta">
                    <div className="booking-summary glass-dark">
                        <h3 className="text4 white">Secure Your Slot</h3>
                        <p className="text6 gray">Ibrahim is currently <b>Available</b> for home visits this week.</p>
                        <button className="main-cta-btn">Book Home Visit</button>
                        <ul className="trust-list">
                            <li>✓ Professional Measurements</li>
                            <li>✓ Fabric Consultation Included</li>
                            <li>✓ 100% Fit Guarantee</li>
                        </ul>
                    </div>
                </aside>
                <div className="mobile-action-bar">
                    <div className="price-info">
                        <span className="text6">Starting</span>
                        <b className="text4">$49</b>
                    </div>
                    <button className="main-cta-btn-sm">Book Visit</button>
                </div>
            </div>
        </div>
    );
};

export default TailorProfile;