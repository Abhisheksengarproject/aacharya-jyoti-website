import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaStar, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const navLinks = [
  { path: '/',             label: 'Home' },
  { path: '/about',        label: 'About' },
  { path: '/services',     label: 'Services' },
  { path: '/horoscope',    label: 'Horoscope' },
  { path: '/blogs',        label: 'Blogs' },
  { path: '/testimonials', label: 'Testimonials' },
  { path: '/contact',      label: 'Contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <FaStar className="navbar__logo-icon" />
          <span className="navbar__logo-text">Aacharya Jyoti</span>
        </NavLink>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
                end={link.path === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA button — desktop only */}
        <NavLink to="/booking" className="btn btn-primary navbar__cta">
          Book Consultation
        </NavLink>

        {/* Hamburger toggle — mobile only */}
        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/*
        ── Mobile Drawer ──────────────────────────────────────────────────
        KEY FIX: Render drawer ONLY when open using conditional rendering.

        OLD code used opacity:0 when closed — the drawer was ALWAYS in the
        DOM taking up ~600px of invisible height, which appeared as a huge
        black void on iOS when scrolling.

        NEW code uses {menuOpen && <div>} — when closed the drawer does NOT
        exist in the DOM at all, so no space is reserved for it.
      */}
      {menuOpen && (
        <div className="navbar__drawer">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`
              }
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/booking"
            className="btn btn-primary"
            style={{ marginTop: '12px', justifyContent: 'center' }}
          >
            Book Consultation
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
