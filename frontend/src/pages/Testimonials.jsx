import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import './Testimonials.css';

const testimonials = [
  { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'Aacharya Jyoti\'s kundali reading was incredibly accurate. She predicted a job change that happened exactly as she said. I am forever grateful for her guidance.', service: 'Kundali Reading', initials: 'PS' },
  { name: 'Rahul Verma', city: 'Delhi', rating: 5, text: 'The marriage compatibility reading gave us so much clarity. We were hesitant about our union but after the session, we felt fully confident. Highly recommended!', service: 'Marriage Compatibility', initials: 'RV' },
  { name: 'Anita Patel', city: 'Ahmedabad', rating: 5, text: 'I consulted for my business launch muhurta. Within months, the business has grown beyond expectations. The timing she suggested was perfect!', service: 'Business Astrology', initials: 'AP' },
  { name: 'Suresh Nair', city: 'Kochi', rating: 5, text: 'The Vastu consultation completely transformed our home energy. We have been experiencing peace and prosperity ever since. Truly life-changing!', service: 'Vastu Shastra', initials: 'SN' },
  { name: 'Deepika Joshi', city: 'Pune', rating: 5, text: 'Devi ji\'s tarot reading touched my soul. She didn\'t just read cards — she understood my energy completely. I felt seen and heard for the first time.', service: 'Tarot Reading', initials: 'DJ' },
  { name: 'Arjun Mehta', city: 'Bangalore', rating: 5, text: 'Career guidance through astrology was something I was skeptical about, but Devi ji changed my mind. Her predictions about my career shift were spot on!', service: 'Career Guidance', initials: 'AM' },
  { name: 'Kavita Singh', city: 'Jaipur', rating: 5, text: 'My numerology session revealed so much about my life path. Devi ji explained everything so clearly and compassionately. I feel more aligned with my purpose now.', service: 'Numerology', initials: 'KS' },
  { name: 'Vikram Rao', city: 'Hyderabad', rating: 5, text: 'The health astrology consultation was eye-opening. She identified potential weak areas and suggested beautiful remedies. My health improved significantly.', service: 'Health Astrology', initials: 'VR' },
  { name: 'Meera Agarwal', city: 'Kolkata', rating: 5, text: 'I have consulted many astrologers but none as genuine and accurate as Aacharya Jyoti. She is truly blessed with the gift of cosmic sight.', service: 'Kundali Reading', initials: 'MA' },
];

const Stars = ({ count }) => (
  <div className="stars">{Array.from({ length: count }).map((_, i) => <FaStar key={i} />)}</div>
);

const Testimonials = () => (
  <div className="page testimonials">
    <div className="stars-bg" />
    <section className="page-header">
      <div className="container">
        <div className="section-label">✦ Client Stories</div>
        <h1 className="section-title">Testimonials</h1>
        <div className="divider" />
        <p className="section-subtitle">Real stories from souls whose lives have been touched by cosmic guidance.</p>
      </div>
    </section>

    {/* Summary Stats */}
    <section className="testimonials-stats">
      <div className="container">
        <div className="tstat-grid">
          {[['5000+', 'Happy Clients'], ['4.9/5', 'Average Rating'], ['98%', 'Would Recommend'], ['15+', 'Years of Trust']].map(([v, l]) => (
            <div key={l} className="tstat-card glass-card">
              <span className="tstat-value">{v}</span>
              <span className="tstat-label">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="t-card glass-card">
              <FaQuoteLeft className="t-card__quote" />
              <p className="t-card__text">{t.text}</p>
              <Stars count={t.rating} />
              <div className="t-card__author">
                <div className="t-card__avatar">{t.initials}</div>
                <div>
                  <p className="t-card__name">{t.name}</p>
                  <p className="t-card__city">{t.city} · {t.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Testimonials;
