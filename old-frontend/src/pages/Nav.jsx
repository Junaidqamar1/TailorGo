import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'
import '../styles/nav.css'

function Nav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  const isTailor   = user?.role === 'tailor'
  const isCustomer = user?.role === 'customer'
  const initial    = user?.name?.charAt(0)?.toUpperCase() || '?'

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function handleLogout() {
    await logout()
    setDropOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container max-w">

        {/* LOGO */}
        <Link to="/" className="logo">
          <img src={logo} alt="TailorGo" />
        </Link>

        {/* HAMBURGER */}
        <div className="menu-toggle" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </div>

        {/* ── NAV LINKS ── */}
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>

          {/* Customer & guest links */}
          {!isTailor && (
            <>
              <li><Link to="/HIW"          onClick={() => setMenuOpen(false)}>How it Works</Link></li>
              <li><Link to="/find-tailors" onClick={() => setMenuOpen(false)}>Find Tailors</Link></li>
              <li><a href="#pricing"       onClick={() => setMenuOpen(false)}>Pricing</a></li>
            </>
          )}

          {/* Tailor-specific links */}
          {isTailor && (
            <>
              <li><Link to="/tailor-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/tailor-orders"    onClick={() => setMenuOpen(false)}>My Orders</Link></li>
              <li><Link to="/tailor-earnings"  onClick={() => setMenuOpen(false)}>Earnings</Link></li>
            </>
          )}

          {/* ── MOBILE ONLY AUTH ACTIONS ── */}
          <li className="mob-auth">
            {user ? (
              <div className="mob-user">
                <div className="mob-user-info">
                  <div className="mob-avatar">{initial}</div>
                  <div>
                    <div className="mob-name">{user.name}</div>
                    <div className="mob-role">{isTailor ? '🪡 Master Tailor' : '👤 Customer'}</div>
                  </div>
                </div>
                <div className="mob-user-links">
                  {isCustomer && (
                    <>
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
                      <Link to="/profile"   onClick={() => setMenuOpen(false)}>👤 Profile</Link>
                    </>
                  )}
                  {isTailor && (
                    <>
                      <Link to="/tailor-dashboard" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                      <Link to="/tailor-profile"   onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
                    </>
                  )}
                  <button className="mob-logout" onClick={handleLogout}>🚪 Logout</button>
                </div>
              </div>
            ) : (
              <div className="mob-guest">
                <Link to="/tailor-signup" className="btn-secondary mob-btn" onClick={() => setMenuOpen(false)}>Partner Login</Link>
                <Link to="/login"         className="btn-primary mob-btn"   onClick={() => setMenuOpen(false)}>Book Now</Link>
              </div>
            )}
          </li>

        </ul>

        {/* ── DESKTOP ACTIONS ── */}
        <div className="nav-actions">

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <Link to="/tailor-signup" className="btn-secondary">Partner Login</Link>
              <Link to="/login"         className="btn-primary">Book Now</Link>
            </>
          )}

          {/* LOGGED IN — CUSTOMER */}
          {isCustomer && (
            <div className="nav-user-wrap" ref={dropRef}>
              <button
                className="nav-avatar-btn"
                onClick={() => setDropOpen(o => !o)}
                title={user.name}
              >
                <div className="nav-avatar">{initial}</div>
                <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
                <svg className={`nav-chevron ${dropOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {dropOpen && (
                <div className="nav-dropdown">
                  <div className="nav-drop-header">
                    <div className="nav-drop-av">{initial}</div>
                    <div>
                      <div className="nav-drop-name">{user.name}</div>
                      <div className="nav-drop-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="nav-drop-divider" />
                  <Link to="/dashboard" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    My Orders
                  </Link>
                  <Link to="/profile" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    My Profile
                  </Link>
                  <Link to="/find-tailors" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    Find Tailors
                  </Link>
                  <div className="nav-drop-divider" />
                  <button className="nav-drop-item nav-drop-logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LOGGED IN — TAILOR */}
          {isTailor && (
            <div className="nav-user-wrap" ref={dropRef}>
              <button
                className="nav-avatar-btn nav-avatar-tailor"
                onClick={() => setDropOpen(o => !o)}
                title={user.name}
              >
                <div className="nav-avatar">{initial}</div>
                <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
                <span className="nav-tailor-pill">Tailor</span>
                <svg className={`nav-chevron ${dropOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {dropOpen && (
                <div className="nav-dropdown">
                  <div className="nav-drop-header nav-drop-header-tailor">
                    <div className="nav-drop-av">{initial}</div>
                    <div>
                      <div className="nav-drop-name">{user.name}</div>
                      <div className="nav-drop-role">🪡 Master Tailor</div>
                    </div>
                  </div>
                  <div className="nav-drop-divider" />
                  <Link to="/tailor-dashboard" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    Dashboard
                  </Link>
                  <Link to="/tailor-orders" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                    My Orders
                  </Link>
                  <Link to="/tailor-earnings" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Earnings
                  </Link>
                  <Link to="/tailor-profile" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    My Profile
                  </Link>
                  <div className="nav-drop-divider" />
                  <button className="nav-drop-item nav-drop-logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Nav