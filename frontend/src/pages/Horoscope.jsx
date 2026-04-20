import { useState } from 'react';
import './Horoscope.css';

const SIGNS = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire', today: 'The cosmos ignites your ambition today. A bold decision made now could set the tone for weeks ahead. Trust your instincts and don\'t second-guess yourself.' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 – May 20', element: 'Earth', today: 'Venus blesses your relationships today. A meaningful conversation with a loved one could deepen your bond. Financial matters also look favourable.' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 – Jun 20', element: 'Air', today: 'Mercury sharpens your intellect. This is an excellent day for writing, negotiations, and learning. A new idea could prove very profitable.' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 – Jul 22', element: 'Water', today: 'The Moon highlights your emotional world. Pay attention to your intuition — it won\'t lead you astray. Home and family matters come into focus.' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire', today: 'The Sun illuminates your creative power. Shine brightly in all you do today. Recognition and praise are on their way to you.' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth', today: 'Mercury guides your analytical mind today. Focus on the details of important projects. Health and wellness routines deserve extra attention.' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 – Oct 22', element: 'Air', today: 'Balance and harmony define your day. Partnerships — both personal and professional — are highlighted. Seek beauty in all forms around you.' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 – Nov 21', element: 'Water', today: 'Pluto empowers your transformative energy. Hidden truths may come to light. Trust the process of change — something beautiful is emerging.' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire', today: 'Jupiter expands your horizons. A wonderful day for learning, travel, or exploring new philosophies. An unexpected opportunity may arrive.' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth', today: 'Saturn rewards your discipline today. Hard work is paying off — recognition from superiors is likely. Stay steady on your path.' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 – Feb 18', element: 'Air', today: 'Uranus sparks innovation within you. Think outside the box — your unique perspective is your greatest asset today. Connect with like-minded souls.' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 – Mar 20', element: 'Water', today: 'Neptune deepens your spiritual connection. Meditation and creative pursuits are highly favoured. Trust in divine timing — all is unfolding perfectly.' },
];

const elementColor = { Fire: '#ef4444', Earth: '#84cc16', Air: '#38bdf8', Water: '#818cf8' };

const Horoscope = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="page horoscope">
      <div className="stars-bg" />
      <section className="page-header">
        <div className="container">
          <div className="section-label">✦ Daily Cosmic Guidance</div>
          <h1 className="section-title">Daily Horoscope</h1>
          <div className="divider" />
          <p className="section-subtitle">Select your zodiac sign to receive today's cosmic message from the stars.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="zodiac-grid">
            {SIGNS.map((sign) => (
              <button
                key={sign.name}
                className={`zodiac-card glass-card ${selected?.name === sign.name ? 'zodiac-card--active' : ''}`}
                onClick={() => setSelected(selected?.name === sign.name ? null : sign)}
              >
                <span className="zodiac-card__symbol" style={{ color: elementColor[sign.element] }}>{sign.symbol}</span>
                <h3 className="zodiac-card__name">{sign.name}</h3>
                <p className="zodiac-card__dates">{sign.dates}</p>
                <span className="zodiac-card__element" style={{ color: elementColor[sign.element] }}>
                  {sign.element}
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="horoscope-reading glass-card">
              <div className="horoscope-reading__header">
                <span className="horoscope-reading__symbol">{selected.symbol}</span>
                <div>
                  <h2>{selected.name}</h2>
                  <p>{selected.dates} · {selected.element} Sign</p>
                </div>
              </div>
              <div className="divider" style={{ margin: '20px 0' }} />
              <p className="horoscope-reading__date">
                ✨ Today's Reading — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="horoscope-reading__text">{selected.today}</p>
              <p className="horoscope-reading__note">
                🔮 For a deeper and personalised reading based on your exact birth details, <a href="/booking">book a consultation</a> with Aacharya Jyoti.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Horoscope;
