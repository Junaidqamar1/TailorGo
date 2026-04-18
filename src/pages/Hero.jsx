import React from 'react'
import "../styles/hero.css"
import img1 from "../assets/img1.png"
import img3 from "../assets/img3.png"
// import tailorVideo from "../assets/tailorVideo.mp4"

function Hero() {
    return (
        <>
            <section class="hero">
               
                {/* <div className="bg-video-container">
                    <video autoPlay loop muted playsInline className="video-source">
                        <source src={tailorVideo} type="video/mp4" />
                    </video>
                    <div className="video-overlay"></div>
                </div> */}
                <div className="bg-img">
                    <img src={img1} alt="" />
                </div>
                <div className="bg-img2">
                    <img src={img3} alt="" />
                </div>
                <div class="hero-container">
                    <div class="hero-content">
                        <p class="text2 f-22">The Modern Atelier</p>
                        <h1 class="head-text">
  Master Tailors. <br />
  At Your <span class="text-capsule">Doorstep.</span>
</h1>
                        <p class="text3">The first on-demand marketplace for bespoke Indian wear. Find a nearby tailor, book a home visit, and get perfectly fitted in 48 hours.</p>

                        <div class="action-bar">
                            <div class="input-group">
                                <span class="icon">📍</span>
                                {/* <input type="text" placeholder="Enter Pincode"> */}
                            </div>
                            <div class="divider"></div>
                            <div class="input-group">
                                <span class="icon">✂️</span>
                                <select>
                                    <option>Select Outfit</option>
                                    <option>Sherwani</option>
                                    <option>Suit</option>
                                    <option>Kurta</option>
                                    <option>Blouse</option>
                                </select>
                            </div>
                            <button class="btn-primary-hero text5">Find Tailors</button>
                        </div>
                        <div className="hero-trust-line">
  <p className="text3">
    <span className="creative-badge">500+</span> Verified Masters, 
    Starts at <span className="creative-price">₹299</span>. 
    Book your tailor <span className="creative-now">now.</span>
  </p>
</div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero