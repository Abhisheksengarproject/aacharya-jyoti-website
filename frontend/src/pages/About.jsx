import { Link } from 'react-router-dom';
import { FaArrowRight, FaAward, FaGraduationCap, FaHeart } from 'react-icons/fa';
import { GiLotus } from 'react-icons/gi';
import './About.css';

const credentials = [
  { icon: <FaGraduationCap />, title: 'Jyotish Acharya', desc: 'Certified from Bharatiya Vidya Bhavan, Delhi' },
  { icon: <FaAward />, title: 'Gold Medalist', desc: 'All India Astrology Conference 2015' },
  { icon: <GiLotus />, title: 'Spiritual Teacher', desc: 'Trained under renowned Guru Shri Ramananda Ji' },
  { icon: <FaHeart />, title: 'Trusted by Thousands', desc: '5000+ satisfied clients across the world' },
];

const timeline = [
  { year: '2008', event: 'Began formal study of Vedic astrology under Guru Ramananda Ji' },
  { year: '2011', event: 'Completed Jyotish Acharya degree from Bharatiya Vidya Bhavan' },
  { year: '2013', event: 'Started private practice in New Delhi' },
  { year: '2015', event: 'Awarded Gold Medal at All India Astrology Conference' },
  { year: '2018', event: 'Launched online consultations — reached clients globally' },
  { year: '2023', event: 'Celebrated 5000+ successful consultations' },
];

const About = () => {
  return (
    <div className="page about">
      <div className="stars-bg" />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="section-label">✦ Our Story</div>
          <h1 className="section-title">About Aacharya Jyoti</h1>
          <div className="divider" />
          <p className="section-subtitle">A journey of stars, wisdom, and a lifelong calling to guide souls.</p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="section about-bio">
        <div className="container about-bio__grid">
          <div className="about-bio__visual">
            <div className="about-bio__photo-frame pulse-glow">
              <div className="about-bio__photo-inner">
                <GiLotus className="about-bio__lotus" />
                <p className="about-bio__name">Aacharya Jyoti</p>
                <span>Vedic Astrologer • Spiritual Guide</span>
              </div>
            </div>
            <div className="about-bio__badge">
              <span className="about-bio__badge-num">15+</span>
              <span>Years of Practice</span>
            </div>
          </div>

          <div className="about-bio__text">
            <div className="section-label">✦ My Journey</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
              Connecting Souls with the<br />
              <span style={{ background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wisdom of the Stars</span>
            </h2>
            <p>With over years of dedicated study and practice in Vedic astrology, I have had the privilege of guiding thousands of souls through life's most profound questions. My journey began as a child, fascinated by the cosmic patterns that my grandmother spoke of, and blossomed into a lifelong calling.</p>
            <br />
            <p>I specialize in Kundali analysis, Numerology, Tarot, and Vastu Shastra — each a different lens through which we can understand the universe's plan for you. I believe that astrology is not about predicting a fixed fate, but about helping you understand the energies at play and make empowered choices.</p>
            <br />
            <p>My approach is compassionate, confidential, and deeply rooted in both ancient scriptures and modern understanding. Whether you are navigating a career crossroads, seeking clarity in relationships, or simply curious about your cosmic blueprint — I am here to light the way.</p>
            <div className="about-bio__actions">
              <Link to="/booking" className="btn btn-primary">Book a Session <FaArrowRight /></Link>
              <Link to="/services" className="btn btn-secondary">Our Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section about-credentials">
        <div className="container">
          <div className="section-header">
            <div className="section-label">✦ Achievements</div>
            <h2 className="section-title">Credentials & Recognition</h2>
            <div className="divider" />
          </div>
          <div className="credentials-grid">
            {credentials.map((c) => (
              <div key={c.title} className="credential-card glass-card">
                <div className="credential-card__icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section about-timeline">
        <div className="container">
          <div className="section-header">
            <div className="section-label">✦ The Journey</div>
            <h2 className="section-title">My Astrological Journey</h2>
            <div className="divider" />
          </div>
          <div className="timeline">
            {timeline.map((item, i) => (
              <div key={i} className={`timeline__item ${i % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}>
                <div className="timeline__content glass-card">
                  <span className="timeline__year">{item.year}</span>
                  <p>{item.event}</p>
                </div>
                <div className="timeline__dot" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
