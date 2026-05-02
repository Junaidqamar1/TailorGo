import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/tailors.css';
import location from '../assets/Icons/location.png';

// Fallback placeholder tailors shown while loading or if location denied
const FALLBACK = [
  { _id: '1', fullName: 'Master Ibrahim',  shopName: 'Ibrahim Tailoring',  shopAddress: 'Bandra West, Mumbai', rating: 4.9, minPrice: 299, distance: null, image: 'https://plus.unsplash.com/premium_photo-1683140721927-aaed410fae29?q=80&w=870&auto=format&fit=crop' },
  { _id: '2', fullName: 'Master Savita',   shopName: 'Savita Creations',   shopAddress: 'Andheri West, Mumbai', rating: 4.8, minPrice: 299, distance: null, image: 'https://plus.unsplash.com/premium_photo-1683129663272-6a157e9c493c?q=80&w=870&auto=format&fit=crop' },
  { _id: '3', fullName: 'Master Rahil',    shopName: 'Rahil Tailors',      shopAddress: 'Juhu, Mumbai',         rating: 5.0, minPrice: 299, distance: null, image: 'https://plus.unsplash.com/premium_photo-1663047237571-fec4456a40a2?q=80&w=870&auto=format&fit=crop' },
];

function StarRating({ rating }) {
  return (
    <div className="rating-tag">
      <span className="star">✦</span>
      {rating?.toFixed(1) || '—'}
    </div>
  );
}

function TailorCard({ tailor }) {
  return (
    <div className="master-card">
      <div className="card-top">
        {tailor.image ? (
          <img
            src={tailor.image}
            alt={tailor.fullName}
            className="master-img"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="master-img master-img-placeholder">
            {tailor.fullName?.charAt(0) || '?'}
          </div>
        )}
        <div className="card-overlay">
          {tailor.distance !== null && tailor.distance !== undefined ? (
            <span className="badge-exp text6"><img src={location} alt="" /> {tailor.distance} km away</span>
          ) : (
            <span className="badge-exp text6">Nearby</span>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="card-title-row">
          <h3 className="text4">{tailor.fullName}</h3>
          <StarRating rating={tailor.rating} />
        </div>

        {tailor.shopAddress && (
          <p className="card-address text6"><img src={location} alt="" /> {tailor.shopAddress}</p>
        )}

        {tailor.minPrice && (
          <p className="card-price text6">Starts from <strong>₹{tailor.minPrice}</strong></p>
        )}

        <Link className="book-btn" to={`/tailor/${tailor.username}`}>
          <span className="text5">Book Appointment</span>
          <div className="btn-icon">→</div>
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="master-card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="card-body">
        <div className="skeleton skeleton-line w-70" />
        <div className="skeleton skeleton-line w-50" style={{ marginTop: 8 }} />
        <div className="skeleton skeleton-line w-40" style={{ marginTop: 8 }} />
        <div className="skeleton skeleton-btn" style={{ marginTop: 16 }} />
      </div>
    </div>
  );
}

function TailorSection() {
  const [tailors, setTailors]   = useState([]);
  const [status, setStatus]     = useState('idle'); // idle | locating | loading | success | error | denied
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchNearbyTailors();
  }, []);

  function fetchNearbyTailors() {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Your browser does not support location services.');
      setTailors(FALLBACK);
      return;
    }

    setStatus('locating');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus('loading');

        try {
          const res = await fetch(
            `http://localhost:5000/api/v1/tailor/nearby?lat=${latitude}&lng=${longitude}&radius=10`,
            { credentials: 'include' }
          );

          const data = await res.json();

          if (res.ok && data.success) {
            if (data.data?.length > 0) {
              setTailors(data.data);
              setStatus('success');
            } else {
              // No tailors found nearby — show fallback
              setTailors(FALLBACK);
              setStatus('empty');
            }
          } else {
            setTailors(FALLBACK);
            setStatus('error');
            setErrorMsg(data.message || 'Could not fetch nearby tailors.');
          }
        } catch (err) {
          console.error('Nearby tailors error:', err);
          setTailors(FALLBACK);
          setStatus('error');
          setErrorMsg('Network error. Showing popular tailors instead.');
        }
      },
      (err) => {
        // User denied location OR timeout
        console.warn('Geolocation denied:', err.message);
        setTailors(FALLBACK);
        setStatus('denied');
      },
      { timeout: 8000, maximumAge: 300000 } // 5 min cache
    );
  }

  const isLoading = status === 'locating' || status === 'loading';

  return (
    <section className="tailor-wrapper max-w">
      <div className="tailor-header">
        <h2 className="text2 f-22">Curated for you</h2>
        <h3 className="text1 f-28">
          Master Tailors <span className="text-capsule-blue">
            {status === 'success' ? 'Nearby' : 'For You'}
          </span>
        </h3>

        {/* STATUS MESSAGES */}
        {status === 'locating' && (
          <p className="tailor-status-msg">📍 Finding tailors near you…</p>
        )}
        {status === 'denied' && (
          <p className="tailor-status-msg tailor-status-warn">
            📍 Location access denied — showing popular tailors.
            <button className="tailor-retry-btn" onClick={fetchNearbyTailors}>Try again</button>
          </p>
        )}
        {status === 'empty' && (
          <p className="tailor-status-msg tailor-status-warn">
            No tailors found within 10 km — showing popular picks instead.
          </p>
        )}
        {status === 'error' && errorMsg && (
          <p className="tailor-status-msg tailor-status-warn">{errorMsg}</p>
        )}
        {status === 'success' && (
          <p className="tailor-status-msg tailor-status-success">
            ✓ {tailors.length} tailors found near you
          </p>
        )}
      </div>

      <div className="tailor-grid">
        {isLoading
          ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
          : tailors.slice(0, 6).map(t => <TailorCard key={t._id} tailor={t} />)
        }
      </div>

      {/* VIEW ALL LINK */}
      {!isLoading && tailors.length > 0 && (
        <div className="tailor-view-all">
          <Link to="/find-tailors" className="view-all-btn">
            View All Tailors →
          </Link>
        </div>
      )}
    </section>
  );
}

export default TailorSection;