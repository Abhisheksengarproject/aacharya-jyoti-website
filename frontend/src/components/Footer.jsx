import { NavLink } from 'react-router-dom';
import { FaStar, FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <FaStar className="footer__logo-icon" />
              <span>Aacharya Jyoti</span>
            </div>
            <p className="footer__tagline">
              Illuminating your path through the ancient wisdom of Vedic astrology. Every star has a story — let me help you read yours.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-btn" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="footer__social-btn footer__social-btn--instagram" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="footer__social-btn footer__social-btn--youtube" aria-label="YouTube"><FaYoutube /></a>
              <a href="https://wa.me/919039941589" className="footer__social-btn footer__social-btn--whatsapp" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__links">
              {[['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/blogs', 'Blogs'], ['/contact', 'Contact']].map(([path, label]) => (
                <li key={path}><NavLink to={path}>{label}</NavLink></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h4 className="footer__col-title">Services</h4>
            <ul className="footer__links">
              {['Kundali Reading', 'Numerology', 'Tarot Reading', 'Vastu Shastra', 'Marriage Compatibility', 'Career Guidance'].map((s) => (
                <li key={s}><NavLink to="/services">{s}</NavLink></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul className="footer__contact-info">
              <li>📍 Sehore, India</li>
              <li>📞 +91 90399 41589</li>
              <li>✉️ jyotisinghsengar1881@gmail.com</li>
              <li>🕐 Mon–Sat: 9AM – 7PM</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} Aacharya Jyoti. All rights reserved.</p>
          <p>Made with <FaHeart className="footer__heart" /> by Abhishek</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
