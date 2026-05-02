import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/TailorProfile.css';

/* ── SERVICE ICON MAP ── */
const SERVICE_ICONS = {
  'shirt stitching': '👔', 'trouser': '👖', 'suit': '🤵',
  'sherwani': '🥻', 'kurta': '👕', 'blouse': '👗',
  'lehenga': '👘', 'salwar': '🧣', 'bandhgala': '🤵',
  'alteration': '✂️', 'nehru jacket': '🧥', 'pathani': '👕',
};
function serviceIcon(name = '') {
  return SERVICE_ICONS[name.toLowerCase()] || '🪡';
}

/* ── TIME AGO ── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1)  return 'Today';
  if (days < 7)  return `${days} day${days > 1 ? 's' : ''} ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
}

/* ── STAR ROW ── */
function Stars({ rating, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="tp-rs-stars" style={{ fontSize: size }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

/* ── SKELETON ── */
function ProfileSkeleton() {
  return (
    <div className="tp-root">
      <div className="tp-hero"><div className="tp-hero-noise" /><div className="tp-hero-glow" /></div>
      <div className="tp-wrapper">
        <div className="tp-left">
          <div className="tp-identity tp-skeleton-card">
            <div className="tp-sk-row">
              <div className="tp-sk tp-sk-avatar" />
              <div style={{ flex: 1 }}>
                <div className="tp-sk tp-sk-line w80" />
                <div className="tp-sk tp-sk-line w50" style={{ marginTop: 10 }} />
                <div className="tp-sk tp-sk-line w60" style={{ marginTop: 10 }} />
              </div>
            </div>
            <div className="tp-sk tp-sk-line w100" style={{ marginTop: 24, height: 6 }} />
          </div>
          <div className="tp-sk tp-sk-block" style={{ height: 52, borderRadius: 14 }} />
          <div className="tp-sk tp-sk-block" style={{ height: 300, borderRadius: 24 }} />
        </div>
        <div className="tp-sidebar">
          <div className="tp-sk tp-sk-block" style={{ height: 360, borderRadius: 24 }} />
          <div className="tp-sk tp-sk-block" style={{ height: 160, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  );
}


export default function TailorProfile() {
  const { username }  = useParams(); // route: /tailor/:username
  const navigate      = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [showAll, setShowAll]     = useState(false);
  const [tailor, setTailor]       = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [imgError, setImgError]   = useState(false);

  useEffect(() => {
    if (!username) { setError('No tailor username provided.'); setLoading(false); return; }
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(
        `https://api.tailorgo.in/api/v1/tailor/profile/${username}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setTailor(data.data.tailor);
        setReviews(data.data.reviews || []);
      } else if (res.status === 404) {
        setError('Tailor not found.');
      } else {
        setError(data.message || 'Could not load profile. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  /* ── LOADING ── */
  if (loading) return <ProfileSkeleton />;

  /* ── ERROR ── */
  if (error) return (
    <div className="tp-root">
      <div className="tp-error-screen">
        <div className="tp-error-icon">🧵</div>
        <h2>{error}</h2>
        <button className="tp-error-btn" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    </div>
  );

  /* ── PENDING / SUSPENDED ── */
  if (tailor.status === 'pending') return (
    <div className="tp-root">
      <div className="tp-error-screen">
        <div className="tp-error-icon">⏳</div>
        <h2>Profile Under Review</h2>
        <p>This tailor's profile is being verified by our team. Check back in 24 hours.</p>
        <button className="tp-error-btn" onClick={() => navigate(-1)}>← Find Other Tailors</button>
      </div>
    </div>
  );

  /* ── DERIVE DISPLAY VALUES ── */
  const initials   = tailor.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
  const isVerified = tailor.verificationStatus === 'verified';
  const avgRating  = tailor.rating?.toFixed(1) || '—';

  return (
    <div className="tp-root">

      {/* ── HERO BANNER ── */}
      <div className="tp-hero">
        <div className="tp-hero-noise" />
        <div className="tp-hero-glow" />
        <div className="tp-breadcrumb">
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
          <span className="tp-bc-sep">›</span>
          <span onClick={() => navigate('/find-tailors')} style={{ cursor: 'pointer' }}>Find Tailors</span>
          <span className="tp-bc-sep">›</span>
          <span className="tp-bc-active">{tailor.fullName}</span>
        </div>
      </div>

      {/* ── PAGE WRAPPER ── */}
      <div className="tp-wrapper">

        {/* ══ LEFT COLUMN ══ */}
        <div className="tp-left">

          {/* IDENTITY CARD */}
          <div className="tp-identity">
            <div className="tp-identity-top">
              <div className="tp-avatar-wrap">
                {tailor.avatar && !imgError ? (
                  <img
                    src={tailor.avatar}
                    alt={tailor.fullName}
                    className="tp-avatar-img"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="tp-avatar">{initials}</div>
                )}
                {isVerified && <div className="tp-avatar-badge">✓</div>}
              </div>

              <div className="tp-identity-info">
                <div className="tp-chips">
                  {isVerified && <span className="tp-chip tp-chip-blue">Verified Master</span>}
                  {tailor.shopAddress && <span className="tp-chip tp-chip-muted">📍 {tailor.shopAddress}</span>}
                  {tailor.status === 'active' && <span className="tp-chip tp-chip-green">● Available</span>}
                  {tailor.status === 'suspended' && <span className="tp-chip tp-chip-red">● Suspended</span>}
                </div>

                <h1 className="tp-name text1">{tailor.fullName}</h1>
                <p className="tp-title">{tailor.shopName}</p>

                {tailor.servicesOffered?.length > 0 && (
                  <div className="tp-specialties">
                    {tailor.servicesOffered.slice(0, 5).map((s, i) => (
                      <span key={i} className="tp-spec-tag">{s.serviceType}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="tp-stats-row">
              <div className="tp-stat">
                <div className="tp-stat-val">{tailor.yearsOfExperience}<span>yrs</span></div>
                <div className="tp-stat-lbl">Experience</div>
              </div>
              <div className="tp-stat-divider" />
              <div className="tp-stat">
                <div className="tp-stat-val">{avgRating}<span>★</span></div>
                <div className="tp-stat-lbl">{reviews.length} Reviews</div>
              </div>
              <div className="tp-stat-divider" />
              <div className="tp-stat">
                <div className="tp-stat-val">{tailor.servicesOffered?.length || 0}</div>
                <div className="tp-stat-lbl">Services</div>
              </div>
              <div className="tp-stat-divider" />
              <div className="tp-stat">
                <div className="tp-stat-val">{tailor.workExperiencePhotos?.length || 0}</div>
                <div className="tp-stat-lbl">Portfolio</div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="tp-tabs">
            {['about', 'services', 'portfolio', 'reviews'].map(t => (
              <button
                key={t}
                className={`tp-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'reviews' && reviews.length > 0 && (
                  <span className="tp-tab-count">{reviews.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── ABOUT TAB ── */}
          {activeTab === 'about' && (
            <div className="tp-section tp-anim">
              <div className="tp-about-grid">
                <div className="tp-about-text">
                  <h2 className="tp-section-title text1">
                    About <span className="text-capsule-blue">{tailor.fullName?.split(' ')[0]}</span>
                  </h2>
                  <p className="tp-about-p">
                    {tailor.shopName} is a professional tailoring service
                    {tailor.shopAddress ? ` based in ${tailor.shopAddress}` : ''}.
                    {tailor.yearsOfExperience
                      ? ` With ${tailor.yearsOfExperience} years of experience, ${tailor.fullName?.split(' ')[0]} brings expert craftsmanship to every order.`
                      : ''}
                  </p>
                  {tailor.servicesOffered?.length > 0 && (
                    <p className="tp-about-p">
                      Specialising in {tailor.servicesOffered.map(s => s.serviceType).join(', ')}.
                      All outfits are crafted with precision and delivered within the agreed timeframe.
                    </p>
                  )}
                </div>

                <div className="tp-about-meta">
                  <div className="tp-meta-card">
                    {tailor.shopAddress && (
                      <div className="tp-meta-row">
                        <span className="tp-meta-icon">⚲</span>
                        <div>
                          <div className="tp-meta-label">Shop Address</div>
                          <div className="tp-meta-val">{tailor.shopAddress}</div>
                        </div>
                      </div>
                    )}
                    <div className="tp-meta-row">
                      <span className="tp-meta-icon">𖠿</span>
                      <div>
                        <div className="tp-meta-label">Visit Type</div>
                        <div className="tp-meta-val">Home Visit + Studio</div>
                      </div>
                    </div>
                    <div className="tp-meta-row">
                      <span className="tp-meta-icon">✔</span>
                      <div>
                        <div className="tp-meta-label">Verification</div>
                        <div className="tp-meta-val" style={{ color: isVerified ? '#16a34a' : '#b45309' }}>
                          {isVerified ? 'Verified by TailorGo' : 'Verification Pending'}
                        </div>
                      </div>
                    </div>
                    <div className="tp-meta-row">
                      <span className="tp-meta-icon"> ★</span>
                      <div>
                        <div className="tp-meta-label">Average Rating</div>
                        <div className="tp-meta-val">{avgRating} / 5.0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SERVICES TAB ── */}
          {activeTab === 'services' && (
            <div className="tp-section tp-anim">
              <h2 className="tp-section-title text1">
                Services & <span className="text-capsule-blue">Pricing</span>
              </h2>
              <p className="tp-section-sub">Starting prices. Final quote given after measurements at home visit.</p>

              {tailor.servicesOffered?.length > 0 ? (
                <div className="tp-services-grid">
                  {tailor.servicesOffered.map((s, i) => (
                    <div key={i} className="tp-service-card">
                      <div className="tp-service-icon">{serviceIcon(s.serviceType)}</div>
                      <div className="tp-service-name">{s.serviceType}</div>
                      <div className="tp-service-price">₹{s.price}+</div>
                      <button
                        className="tp-service-btn"
                        onClick={() => navigate(`/booking?tailor=${tailor.username}`)}
                      >
                        Book →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tp-empty-state">No services listed yet.</div>
              )}
            </div>
          )}

          {/* ── PORTFOLIO TAB ── */}
          {activeTab === 'portfolio' && (
            <div className="tp-section tp-anim">
              <h2 className="tp-section-title text1">
                Portfolio <span className="text-capsule-blue">Work</span>
              </h2>
              <p className="tp-section-sub">Real photos of previous work uploaded by the tailor.</p>

              {tailor.workExperiencePhotos?.length > 0 ? (
                <div className="tp-portfolio-grid">
                  {tailor.workExperiencePhotos.map((url, i) => (
                    <div key={i} className="tp-portfolio-item">
                      <img
                        src={url}
                        alt={`Work ${i + 1}`}
                        className="tp-portfolio-real-img"
                        loading="lazy"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <div className="tp-portfolio-overlay">
                        <span>Work Photo {i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tp-empty-state">
                  📸 No portfolio photos uploaded yet.
                </div>
              )}
            </div>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'reviews' && (
            <div className="tp-section tp-anim">
              <div className="tp-reviews-header">
                <h2 className="tp-section-title text1">
                  What Clients <span className="text-capsule-blue">Say</span>
                </h2>
                {reviews.length > 0 && (
                  <div className="tp-rating-summary">
                    <div className="tp-rs-number">{avgRating}</div>
                    <div>
                      <Stars rating={tailor.rating || 0} />
                      <div className="tp-rs-count">{reviews.length} verified reviews</div>
                    </div>
                  </div>
                )}
              </div>

              {reviews.length > 0 ? (
                <>
                  <div className="tp-reviews-list">
                    {(showAll ? reviews : reviews.slice(0, 3)).map((r, i) => (
                      <div key={r._id || i} className="tp-review-card">
                        <div className="tp-review-top">
                          <div className="tp-rev-av">
                            {r.reviewerName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="tp-rev-info">
                            <div className="tp-rev-name">{r.reviewerName || 'Anonymous'}</div>
                            <div className="tp-rev-date">{timeAgo(r.createdAt)}</div>
                          </div>
                          <div className="tp-rev-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                        </div>
                        <p className="tp-rev-text">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                  {!showAll && reviews.length > 3 && (
                    <button className="tp-show-more" onClick={() => setShowAll(true)}>
                      Show all {reviews.length} reviews →
                    </button>
                  )}
                </>
              ) : (
                <div className="tp-empty-state">⭐ No reviews yet — be the first to book!</div>
              )}
            </div>
          )}

        </div>

        {/* ══ RIGHT SIDEBAR ══ */}
        <aside className="tp-sidebar">
          <div className="tp-book-card">
            <div className="tp-book-top">
              <div className="tp-book-price-row">
                <div>
                  <div className="tp-book-label">Visit Fee</div>
                  <div className="tp-book-price">
                    {tailor.servicesOffered?.length > 0
                      ? `₹${Math.min(...tailor.servicesOffered.map(s => s.price))}+`
                      : '₹299'
                    }
                  </div>
                  <div className="tp-book-sub">Final price after measurements</div>
                </div>
                <div className="tp-book-rating">
                  <div className="tp-br-num">{avgRating}</div>
                  <div className="tp-br-stars">{'★'.repeat(Math.round(tailor.rating || 0))}</div>
                  <div className="tp-br-count">{reviews.length} reviews</div>
                </div>
              </div>
              {tailor.status === 'active' && (
                <div className="tp-available-badge">
                  <span className="tp-avail-dot" /> Available for bookings
                </div>
              )}
            </div>

            <button
              className="tp-cta-primary"
              onClick={() => navigate(`/booking?tailor=${tailor.username}`)}
              disabled={tailor.status !== 'active'}
            >
              {tailor.status === 'active' ? 'Place An Order →' : 'Currently Unavailable'}
            </button>
            <button className="tp-cta-secondary">Send Message</button>

            <div className="tp-trust-list">
              {isVerified && <div className="tp-trust-item">🔒 Verified & background-checked</div>}
              <div className="tp-trust-item">📐 Precise home measurements</div>
              <div className="tp-trust-item">🚚 Outfit delivered in 48–72 hrs</div>
              <div className="tp-trust-item">↩️ Free alterations if fit is off</div>
            </div>
          </div>

          <div className="tp-quick-stats">
            <div className="tp-qs-title">Performance</div>
            <div className="tp-qs-grid">
              <div className="tp-qs-item">
                <div className="tp-qs-val">{avgRating}★</div>
                <div className="tp-qs-lbl">Rating</div>
              </div>
              <div className="tp-qs-item">
                <div className="tp-qs-val">{reviews.length}</div>
                <div className="tp-qs-lbl">Reviews</div>
              </div>
              <div className="tp-qs-item">
                <div className="tp-qs-val">{tailor.yearsOfExperience}yr</div>
                <div className="tp-qs-lbl">Exp.</div>
              </div>
              <div className="tp-qs-item">
                <div className="tp-qs-val">{tailor.servicesOffered?.length || 0}</div>
                <div className="tp-qs-lbl">Services</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM BAR */}
      <div className="tp-mobile-bar">
        <div className="tp-mb-info">
          <div className="tp-mb-label">Starting from</div>
          <div className="tp-mb-price">
            {tailor.servicesOffered?.length > 0
              ? `₹${Math.min(...tailor.servicesOffered.map(s => s.price))}+`
              : '₹299'
            }
          </div>
        </div>
        <button
          className="tp-mb-btn"
          onClick={() => navigate(`/booking?tailor=${tailor.username}`)}
          disabled={tailor.status !== 'active'}
        >
          Place An Order →
        </button>
      </div>

    </div>
  );
}