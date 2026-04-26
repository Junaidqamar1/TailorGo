import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import tailorVideo from "../assets/tailorVideo.mp4"
function Login() {
  return (
    <section className="auth-pro">


      <div className="auth-header">
        <h2 className="text1 f-28"> Tailoring, <span className="text-capsule-blue">Reimagined</span></h2>
        {/* <h1>
          Tailoring, <span>Reimagined</span>
        </h1> */}
        <p>Seamless stitching. Real tailors. Delivered to your door.</p>
      </div>


      <div className="auth-layout">


        <div className="auth-customer">

          <h2>Login as Customer</h2>

          <form className="auth-form">
            <input type="email" placeholder="Email address" />
            <input type="password" placeholder="Password" />

            <button className="auth-btn">Continue</button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/signup">Create account</Link>
          </p>

        </div>


        <div className="auth-tailor">
          <video autoPlay loop muted playsInline className="video-source">
            <source src={tailorVideo} type="video/mp4" />
          </video>
          <div className="video-overlay"></div>
          <h2>Are you a Tailor?</h2>
          <p>
            Start receiving orders from customers near you and grow your business.
          </p>

          <Link to="/tailor-login" className="tailor-btn">
            Become a Tailor →
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Login;