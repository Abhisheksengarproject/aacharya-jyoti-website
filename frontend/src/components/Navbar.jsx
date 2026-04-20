import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaStar, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/horoscope', label: 'Horoscope' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/testimonials', label: 'Testimonials' },
  { path: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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

        {/* CTA */}
        <NavLink to="/booking" className="btn btn-primary navbar__cta">
          Book Consultation
        </NavLink>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
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
        <NavLink to="/booking" className="btn btn-primary" style={{ marginTop: '16px', justifyContent: 'center' }}>
          Book Consultation
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
