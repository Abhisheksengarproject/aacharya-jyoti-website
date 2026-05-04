import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaOm, FaFire, FaGraduationCap } from 'react-icons/fa';
import { GiLotus } from 'react-icons/gi';
import './Services.css';

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const consultations = [
  {
    id: 'kundali-advanced', icon: '🔮',
    title: 'Kundali Reading (Advanced KP)',
    hindi: 'कुंडली रीडिंग — एडवांस्ड KP',
    tagline: 'Deep-dive into your cosmic blueprint',
    desc: 'Advanced KP system analysis of your birth chart — revealing planetary positions, dasha periods, life events, and precise predictions.',
    features: ['KP Birth Chart Analysis', 'Dasha & Antardasha', 'Life Event Predictions', 'Remedies & Gemstones'],
    price: '₹2,100', duration: '60 min',
  },
  {
    id: 'kundali-basic', icon: '⭐',
    title: 'Kundali Reading (Basic)',
    hindi: 'कुंडली रीडिंग — बेसिक',
    tagline: 'Your essential cosmic overview',
    desc: 'A concise Kundali reading covering key planetary influences, your moon sign, and important life areas for quick clarity.',
    features: ['Birth Chart Overview', 'Moon & Ascendant', 'Key Life Areas', 'Basic Remedies'],
    price: '₹1,100', duration: '30 min',
  },
  {
    id: 'numerology', icon: '🔢',
    title: 'Numerology',
    hindi: 'न्यूमेरोलॉजी',
    tagline: 'The power of numbers',
    desc: 'Discover how numbers in your birth date and name shape your personality, relationships, and life purpose.',
    features: ['Life Path Number', 'Destiny Number', 'Lucky Numbers', 'Name Correction'],
    price: '₹1,000', duration: '45 min',
  },
  {
    id: 'tarot', icon: '🃏',
    title: 'Tarot Card Reading',
    hindi: 'टेरोट कार्ड रीडिंग',
    tagline: 'Messages from the universe',
    desc: 'Gain clarity on love, career, finance, and life through the ancient art of Tarot card reading.',
    features: ['Past-Present-Future', 'Love & Relationships', 'Career Guidance', 'Monthly Forecast'],
    price: '₹800', duration: '30 min',
  },
  {
    id: 'vastu', icon: '🏠',
    title: 'Vastu Shastra',
    hindi: 'वास्तु शास्त्र',
    tagline: 'Harmony in your space',
    desc: 'Align your home or office with cosmic energies to attract prosperity, health, and positive vibrations.',
    features: ['Home/Office Analysis', 'Direction Mapping', 'Energy Flow', 'Remedies Without Demolition'],
    price: '₹2,100', duration: '60 min',
  },
  {
    id: 'marriage', icon: '💑',
    title: 'Marriage Compatibility',
    hindi: 'मैरिज कंपेटिबिलिटी',
    tagline: 'Stars aligned together',
    desc: 'A thorough Kundali matching and compatibility analysis for a blessed and harmonious marital union.',
    features: ['Guna Milan (36 Points)', 'Mangalik Check', 'Planetary Compatibility', 'Auspicious Muhurta'],
    price: '₹1,100', duration: '45 min',
  },
  {
    id: 'career', icon: '💼',
    title: 'Career Guidance',
    hindi: 'कैरियर गाइडेंस',
    tagline: 'Your destined path',
    desc: 'Find your ideal career path, favorable periods for growth, and strategies to overcome professional obstacles.',
    features: ['Career Aptitude', 'Promotion Timing', 'Business vs Job', 'Favorable Industries'],
    price: '₹1,000', duration: '45 min',
  },
  {
    id: 'health', icon: '🌿',
    title: 'Health Astrology',
    hindi: 'स्वास्थ्य एस्ट्रोलॉजी',
    tagline: 'Cosmic wellness guidance',
    desc: 'Understand health vulnerabilities indicated in your chart and receive astrological preventive guidance.',
    features: ['Health Indicators', 'Disease Prediction', 'Remedy Suggestions', 'Diet & Lifestyle Guidance'],
    price: '₹1,200', duration: '60 min',
  },
];

const pujas = [
  {
    id: 'mahamrityunjaya', icon: '🕉️',
    title: 'Maha Mrityunjaya Puja',
    hindi: 'महामृत्युंजय पूजा',
    tagline: 'The great victory over death',
    desc: 'The most powerful Vedic puja dedicated to Lord Shiva for health, longevity, protection from illness, accidents, and untimely death.',
    features: ['11,000 Mantras', 'Havan & Ahuti', 'Rudra Abhishek', 'Prasad Dispatch'],
    price: '₹1,25,000',
  },
  {
    id: 'navgrah', icon: '🌟',
    title: 'Sampurna / Navgrah Shanti',
    hindi: 'सम्पूर्ण / नवग्रह शांति',
    tagline: 'Peace of all nine planets',
    desc: 'A complete Navgrah Shanti puja to balance the energies of all nine planets in your horoscope for overall peace and prosperity.',
    features: ['All 9 Planet Mantras', 'Havan Ceremony', 'Graha Dosh Removal', 'Prosperity Blessings'],
    price: '₹51,000',
  },
  {
    id: 'kalsarp', icon: '🐍',
    title: 'Kaal Sarp Dosh Shanti',
    hindi: 'कालसर्प दोष शांति',
    tagline: 'Freedom from serpent affliction',
    desc: 'A specialized puja to neutralize the negative effects of Kaal Sarp Dosh in the horoscope, bringing relief from obstacles and delays.',
    features: ['Kaal Sarp Analysis', 'Shiva Puja', 'Rahu-Ketu Shanti', 'Protection Rituals'],
    price: '₹31,000',
  },
  {
    id: 'mangaldosh', icon: '🔴',
    title: 'Mangal Dosh Shanti',
    hindi: 'मंगल दोष शांति',
    tagline: 'Mars affliction remedy',
    desc: 'Remedial puja to pacify Mars and remove Mangal Dosh, especially beneficial for marriage delays and marital harmony.',
    features: ['Mangal Dosh Check', 'Hanuman Puja', 'Marriage Harmony', 'Mars Pacification'],
    price: '₹31,500',
  },
  {
    id: 'rinmukti', icon: '💚',
    title: 'Rin Mukti Dosh Nivaran',
    hindi: 'ऋण मुक्ति दोष निवारण',
    tagline: 'Freedom from debt & bondage',
    desc: 'A powerful puja to remove Rin Dosh (ancestral debt), financial blockages, and karmic obstacles hindering progress.',
    features: ['Pitru Dosh Analysis', 'Rin Mukti Path', 'Financial Unblocking', 'Ancestral Healing'],
    price: '₹31,000',
  },
  {
    id: 'vivah', icon: '💒',
    title: 'Vivah Sanskar',
    hindi: 'विवाह संस्कार',
    tagline: 'Sacred marriage ceremony',
    desc: 'A traditional Vedic marriage ceremony performed with complete rituals, mantras, and blessings for a sacred and auspicious union.',
    features: ['Vedic Rituals', 'Saptapadi Ceremony', 'Muhurta Selection', 'Priestly Services'],
    price: '₹25,000',
  },
  {
    id: 'vasturatna', icon: '💎',
    title: 'Vastu Ratna Vichar',
    hindi: 'वास्तु रत्न विचार',
    tagline: 'Gemstone & Vastu consultation',
    desc: 'A specialized consultation combining Vastu principles with gemstone therapy to maximize positive cosmic energy in your space and life.',
    features: ['Space Energy Analysis', 'Gemstone Recommendation', 'Placement Guidance', 'Energy Correction'],
    price: '₹5,100',
  },
];

const courses = [
  {
    id: 'basic-course', icon: '📖',
    title: 'Basic Astrology Course',
    hindi: 'बेसिक ज्योतिष कोर्स',
    tagline: 'Begin your cosmic journey',
    desc: 'A structured beginner course covering the fundamentals of Vedic astrology — planets, houses, signs, and basic chart reading.',
    features: ['12 Houses & Signs', 'Planetary Energies', 'Birth Chart Basics', 'Certificate Provided'],
    price: '₹4,500',
  },
  {
    id: 'advanced-course', icon: '🎓',
    title: 'Advanced Astrology Course',
    hindi: 'एडवांस्ड ज्योतिष कोर्स',
    tagline: 'Master the cosmic sciences',
    desc: 'An advanced program covering KP system, Dasha predictions, Nakshatras, and advanced techniques for professional astrology practice.',
    features: ['KP System', 'Dasha Analysis', 'Nakshatra Study', 'Professional Certification'],
    price: '₹11,500',
  },
];

/* ─── Tab Config ────────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'consultations', label: '🔮 Consultations', icon: <GiLotus /> },
  { key: 'puja',          label: '🪔 Puja & Rituals', icon: <FaFire /> },
  { key: 'courses',       label: '📚 Courses',        icon: <FaGraduationCap /> },
];

/* ─── Service Card Component ────────────────────────────────────────────────── */
const ServiceCard = ({ svc }) => (
  <div className="svc-card glass-card">
    <div className="svc-card__top">
      <span className="svc-card__icon">{svc.icon}</span>
      {svc.duration && <span className="svc-card__dur-badge">⏱ {svc.duration}</span>}
    </div>
    <h3 className="svc-card__title">{svc.title}</h3>
    <p className="svc-card__hindi">{svc.hindi}</p>
    <p className="svc-card__tagline">{svc.tagline}</p>
    <p className="svc-card__desc">{svc.desc}</p>
    <ul className="svc-card__features">
      {svc.features.map((f) => (
        <li key={f}><FaCheck className="svc-card__check" />{f}</li>
      ))}
    </ul>
    <div className="svc-card__footer">
      <span className="svc-card__price">{svc.price}</span>
      <Link to="/booking" className="btn btn-primary svc-card__btn">
        Book Now <FaArrowRight />
      </Link>
    </div>
  </div>
);

/* ─── Page ──────────────────────────────────────────────────────────────────── */
const Services = () => {
  const [activeTab, setActiveTab] = useState('consultations');

  const dataMap = {
    consultations,
    puja: pujas,
    courses,
  };

  const subtitleMap = {
    consultations: 'Personal consultations with Aacharya Jyoti — choose the guidance you need.',
    puja: 'Sacred Vedic rituals & Graha Shanti pujas performed with complete devotion.',
    courses: 'Learn the ancient science of Vedic astrology from an expert practitioner.',
  };

  return (
    <div className="page services">
      <div className="stars-bg" />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="section-label">✦ What We Offer</div>
          <h1 className="section-title">Our Cosmic Services</h1>
          <div className="divider" />
          <p className="section-subtitle">
            Astrology consultations, sacred pujas & learning courses — all under one roof.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          {/* Tab Navigation */}
          <div className="svc-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`svc-tab-btn ${activeTab === tab.key ? 'svc-tab-btn--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Subtitle */}
          <p className="svc-tab-subtitle">{subtitleMap[activeTab]}</p>

          {/* Cards Grid */}
          <div className="services-cards">
            {dataMap[activeTab].map((svc) => (
              <ServiceCard key={svc.id} svc={svc} />
            ))}
          </div>

          {/* Book CTA */}
          <div className="svc-cta">
            <p>Not sure which service to choose?</p>
            <Link to="/contact" className="btn btn-secondary">Ask Aacharya Jyoti <FaArrowRight /></Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Services;
