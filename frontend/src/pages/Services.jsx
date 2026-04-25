import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import './Services.css';

const services = [
  {
    id: 'kundali', icon: '🔮', title: 'Kundali Reading',
    tagline: 'Your Cosmic Blueprint',
    desc: 'A detailed analysis of your birth chart revealing personality traits, life events, strengths, and challenges written in the stars.',
    features: ['Birth Chart Analysis', 'Planetary Positions', 'Dasha Predictions', 'Remedies & Gemstones'],
    price: '₹1', duration: '60 min', category: 'Kundali',
  },
  {
    id: 'numerology', icon: '🔢', title: 'Numerology',
    tagline: 'The Power of Numbers',
    desc: 'Discover how the numbers in your birth date and name influence your personality, relationships, and life purpose.',
    features: ['Life Path Number', 'Destiny Number', 'Lucky Numbers', 'Name Correction'],
    price: '₹1,000', duration: '45 min', category: 'Numerology',
  },
  {
    id: 'tarot', icon: '🃏', title: 'Tarot Reading',
    tagline: 'Messages from the Universe',
    desc: 'Unlock guidance on love, career, finance, and spirituality through the ancient art of Tarot card reading.',
    features: ['Past-Present-Future Spread', 'Love & Relationships', 'Career Guidance', 'Monthly Forecast'],
    price: '₹800', duration: '30 min', category: 'Tarot',
  },
  {
    id: 'vastu', icon: '🏠', title: 'Vastu Shastra',
    tagline: 'Harmony in Your Space',
    desc: 'Align your home or office with cosmic energies to attract prosperity, health, and positive vibrations.',
    features: ['Home/Office Analysis', 'Direction Mapping', 'Energy Flow', 'Remedies Without Demolition'],
    price: '₹2,000', duration: '90 min', category: 'Vastu',
  },
  {
    id: 'marriage', icon: '💑', title: 'Marriage Compatibility',
    tagline: 'Stars Aligned Together',
    desc: 'A thorough Kundali matching and compatibility analysis to ensure a blessed and harmonious marital union.',
    features: ['Guna Milan (36 Points)', 'Mangalik Check', 'Planetary Compatibility', 'Auspicious Muhurta'],
    price: '₹1,200', duration: '60 min', category: 'Kundali',
  },
  {
    id: 'career', icon: '💼', title: 'Career Guidance',
    tagline: 'Your Destined Path',
    desc: 'Discover your ideal career path, favorable periods for growth, and strategies to overcome professional obstacles.',
    features: ['Career Aptitude', 'Promotion Timing', 'Business vs Job', 'Favorable Industries'],
    price: '₹1,000', duration: '45 min', category: 'Kundali',
  },
  {
    id: 'health', icon: '🌿', title: 'Health Astrology',
    tagline: 'Cosmic Wellness Guidance',
    desc: 'Understand health vulnerabilities indicated by your chart and receive astrological preventive guidance.',
    features: ['Health Indicators', 'Disease Prediction', 'Remedy Suggestions', 'Favourable Diet & Lifestyle'],
    price: '₹1,200', duration: '60 min', category: 'Kundali',
  },
  {
    id: 'business', icon: '📈', title: 'Business Astrology',
    tagline: 'Cosmic Success Strategy',
    desc: 'Time your business decisions, partnerships, and launches using planetary cycles for maximum success.',
    features: ['Muhurta for Launch', 'Partnership Analysis', 'Financial Cycles', 'Growth Periods'],
    price: '₹1,800', duration: '60 min', category: 'Kundali',
  },
];

const Services = () => {
  const [active, setActive] = useState('all');
  const categories = ['all', 'Kundali', 'Numerology', 'Tarot', 'Vastu'];
  const filtered = active === 'all' ? services : services.filter((s) => s.category === active);

  return (
    <div className="page services">
      <div className="stars-bg" />
      <section className="page-header">
        <div className="container">
          <div className="section-label">✦ What We Offer</div>
          <h1 className="section-title">Our Cosmic Services</h1>
          <div className="divider" />
          <p className="section-subtitle">Each service is a doorway to deeper self-understanding and cosmic alignment.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter Tabs */}
          <div className="services-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`services-filter__btn ${active === cat ? 'services-filter__btn--active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="services-cards">
            {filtered.map((svc) => (
              <div key={svc.id} className="svc-card glass-card">
                <div className="svc-card__top">
                  <span className="svc-card__icon">{svc.icon}</span>
                  <span className="badge badge-gold">{svc.category}</span>
                </div>
                <h3 className="svc-card__title">{svc.title}</h3>
                <p className="svc-card__tagline">{svc.tagline}</p>
                <p className="svc-card__desc">{svc.desc}</p>
                <ul className="svc-card__features">
                  {svc.features.map((f) => (
                    <li key={f}><FaCheck className="svc-card__check" />{f}</li>
                  ))}
                </ul>
                <div className="svc-card__footer">
                  <div className="svc-card__meta">
                    <span className="svc-card__price">{svc.price}</span>
                    <span className="svc-card__duration">⏱ {svc.duration}</span>
                  </div>
                  <Link to="/booking" className="btn btn-primary svc-card__btn">
                    Book Now <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
