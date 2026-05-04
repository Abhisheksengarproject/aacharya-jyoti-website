import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaMoon, FaOm, FaWhatsapp } from 'react-icons/fa';
import { GiStarFormation } from 'react-icons/gi';
import aacharyaImg from '../assets/images/image.jpg';
import './Home.css';

const services = [
  { icon: '🔮', title: 'Kundali Reading (Advanced)', desc: 'Deep KP system analysis of your birth chart — planetary positions, dasha, and precise life predictions.' },
  { icon: '⭐', title: 'Kundali Reading (Basic)', desc: 'A concise Kundali overview covering key influences and important life areas for quick clarity.' },
  { icon: '🔢', title: 'Numerology', desc: 'Discover the power of numbers and how they shape your destiny, relationships, and life purpose.' },
  { icon: '🃏', title: 'Tarot Card Reading', desc: 'Gain clarity on love, career, finance, and life through the ancient art of Tarot.' },
  { icon: '🏗️', title: 'Vastu Shastra', desc: 'Align your home or office with cosmic energies for prosperity, health, and positive vibrations.' },
  { icon: '💑', title: 'Marriage Compatibility', desc: 'Thorough Kundali matching and compatibility analysis for a blessed and harmonious union.' },
  { icon: '🕉️', title: 'Navgrah Shanti Puja', desc: 'Complete Navgrah puja to balance energies of all nine planets for overall peace and prosperity.' },
  { icon: '💎', title: 'Vastu Ratna Vichar', desc: 'Specialized consultation combining Vastu principles with gemstone therapy for cosmic harmony.' },
];

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '5000+', label: 'Happy Clients' },
  { value: '50+', label: 'Services Offered' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const Home = () => {
  return (
    <div className="page home">
      {/* Global background gradient — position:fixed z-index:-1, behind everything */}
      <div className="stars-bg" />

      {/* Hero Section */}
      <section className="hero">

        <div className="hero__zodiac-ring">
          {zodiacSigns.map((sign, i) => (
            <span key={i} className="hero__zodiac-sign" style={{ '--i': i }}>
              {sign}
            </span>
          ))}
        </div>

        <div className="container hero__content">
          {/* LEFT — Text */}
          <div className="hero__text">
            <div className="section-label">✨ Vedic Astrology &amp; Spiritual Guidance</div>
            <h1 className="hero__title">
              Discover Your <br />
              <span className="hero__title-accent">Cosmic Destiny</span>
            </h1>
            <p className="hero__subtitle">
              With over 15 years of experience in Vedic astrology, Aacharya Jyoti
              guides you through life's journey with the ancient wisdom of the stars.
              From Kundali readings to Vastu consultations — your answers await.
            </p>
            <div className="hero__actions">
              <Link to="/booking" className="btn btn-primary hero__btn">
                Book Consultation <FaArrowRight />
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Know More
              </Link>
              <a
                href="https://wa.me/919039941589"
                className="hero__whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>

          {/* RIGHT — Photo */}
          <div className="hero__visual">
            {/* Removed pulse-glow and spin-slow from wrapper — causes iOS black screen */}
            <div className="hero__photo-wrapper">
              <div className="hero__photo-ring" />
              <div className="hero__photo-inner">
                <img
                  src={aacharyaImg}
                  alt="Aacharya Jyoti — Vedic Astrologer"
                  className="hero__photo-img"
                />
              </div>
              <div className="hero__photo-nameplate">
                <p>Aacharya Jyoti</p>
                <span>Vedic Astrologer</span>
              </div>
            </div>

            {/* Floating cards — hidden on mobile via CSS */}
            <div className="hero__floating-cards">
              <div className="hero__float-card" style={{ top: '5%', right: '10px' }}>
                <FaStar className="hero__float-icon" style={{ color: 'var(--accent-gold)' }} />
                <span>Kundali Expert</span>
              </div>
              <div className="hero__float-card" style={{ bottom: '25%', left: '-40px' }}>
                <FaMoon className="hero__float-icon" style={{ color: '#a855f7' }} />
                <span>Moon Signs</span>
              </div>
              <div className="hero__float-card" style={{ top: '50%', right: '0px' }}>
                <FaOm className="hero__float-icon" style={{ color: 'var(--accent-teal)' }} />
                <span>Spiritual Healing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card glass-card">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section services-preview">
        <div className="container">
          <div className="section-header">
            <div className="section-label">✦ What We Offer</div>
            <h2 className="section-title">Our Cosmic Services</h2>
            <div className="divider" />
            <p className="section-subtitle">
              Explore the many ways Aacharya Jyoti can illuminate your path to happiness and success.
            </p>
          </div>
          <div className="services-grid">
            {services.map((svc) => (
              <div key={svc.title} className="service-card glass-card">
                <div className="service-card__icon">{svc.icon}</div>
                <h3 className="service-card__title">{svc.title}</h3>
                <p className="service-card__desc">{svc.desc}</p>
                <Link to="/services" className="service-card__link">
                  Learn More <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/services" className="btn btn-purple">
              View All Services <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-banner__glow" />
        <div className="container cta-banner__content">
          <GiStarFormation className="cta-banner__star-icon" />
          <h2>Ready to Unveil Your Destiny?</h2>
          <p>Schedule a personal consultation with Aacharya Jyoti and begin your cosmic journey today.</p>
          <div className="cta-banner__actions">
            <Link to="/booking" className="btn btn-primary">Book Now</Link>
            <Link to="/contact" className="btn btn-secondary">Ask a Question</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
