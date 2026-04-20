import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('🙏 Your message has been sent! We will reply within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page contact">
      <div className="stars-bg" />
      <section className="page-header">
        <div className="container">
          <div className="section-label">✦ Get In Touch</div>
          <h1 className="section-title">Contact Aacharya Jyoti</h1>
          <div className="divider" />
          <p className="section-subtitle">Have a question? Ready to begin your cosmic journey? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          {/* Info Cards */}
          <div className="contact-info">
            <h3 className="contact-info__heading">Reach Out Directly</h3>
            <p className="contact-info__subtext">You can also use the live chat widget at the bottom-right of the screen for instant support.</p>

            {[
              { icon: <FaMapMarkerAlt />, label: 'Location', value: 'Sehore, India (Online Worldwide)' },
              { icon: <FaPhone />, label: 'Phone / WhatsApp', value: '+91 94250 24728' },
              { icon: <FaEnvelope />, label: 'Email', value: 'jyotisinghsengar1881@gmail.com' },
              { icon: <FaClock />, label: 'Hours', value: 'Mon–Sat: 9:00 AM – 7:00 PM IST' },
            ].map((item) => (
              <div key={item.label} className="contact-info-card glass-card">
                <div className="contact-info-card__icon">{item.icon}</div>
                <div>
                  <span className="contact-info-card__label">{item.label}</span>
                  <p className="contact-info-card__value">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <h3 className="contact-form__heading">Send a Message</h3>
            <div className="contact-form__row">
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ramesh Kumar" required />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>
            </div>
            <div className="contact-form__row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}>
                  {['General Inquiry', 'Book Appointment', 'Kundali Reading', 'Numerology', 'Tarot', 'Vastu', 'Other'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Your Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell me about your questions or what you'd like guidance on..." required />
            </div>
            <button type="submit" className="btn btn-primary contact-form__submit" disabled={loading}>
              {loading ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
