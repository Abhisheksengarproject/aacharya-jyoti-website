import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock, FaEye } from 'react-icons/fa';
import api from '../utils/api';
import './Blogs.css';

const SAMPLE_BLOGS = [
  { _id: '1', title: 'Understanding Your Sun Sign and Its Influence', category: 'Horoscope', excerpt: 'Your Sun sign is the core of your astrological identity. Discover how it shapes your personality, strengths, and life purpose.', image: '', views: 245, createdAt: '2024-01-15', slug: 'understanding-sun-sign' },
  { _id: '2', title: 'The Power of Mercury Retrograde', category: 'General', excerpt: 'Mercury retrograde often gets blamed for chaos — but what does it truly mean astrologically? Learn how to thrive during this period.', image: '', views: 189, createdAt: '2024-02-01', slug: 'mercury-retrograde' },
  { _id: '3', title: 'Numerology: Finding Your Life Path Number', category: 'Numerology', excerpt: 'Your Life Path Number is the most significant number in numerology. Find out what yours reveals about your destiny.', image: '', views: 312, createdAt: '2024-02-20', slug: 'life-path-number' },
  { _id: '4', title: 'Vastu Tips for a Prosperous Home', category: 'Vastu', excerpt: 'Simple Vastu adjustments at home can transform the energy flow and invite prosperity, health, and harmony.', image: '', views: 278, createdAt: '2024-03-05', slug: 'vastu-tips-home' },
  { _id: '5', title: 'What Your Moon Sign Says About You', category: 'Kundali', excerpt: 'While the Sun represents your ego, the Moon represents your emotions and subconscious. Explore the depth of your Moon sign.', image: '', views: 198, createdAt: '2024-03-18', slug: 'moon-sign-guide' },
  { _id: '6', title: 'Saturn Return: A Life-Changing Transit', category: 'General', excerpt: 'Saturn Return, occurring around age 27-30, is one of the most powerful astrological transits. Are you ready for yours?', image: '', views: 421, createdAt: '2024-04-02', slug: 'saturn-return' },
];

const categoryEmoji = { Horoscope:'♈', General:'⭐', Numerology:'🔢', Vastu:'🏠', Kundali:'🔮', Tarot:'🃏', Spirituality:'🙏' };

const Blogs = () => {
  const [blogs, setBlogs] = useState(SAMPLE_BLOGS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Horoscope', 'Kundali', 'Numerology', 'Tarot', 'Vastu', 'Spirituality', 'General'];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/blogs', { params: { category: activeCategory } });
        if (data.blogs?.length > 0) setBlogs(data.blogs);
      } catch {
        // use sample data
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [activeCategory]);

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page blogs">
      <div className="stars-bg" />
      <section className="page-header">
        <div className="container">
          <div className="section-label">✦ Cosmic Insights</div>
          <h1 className="section-title">Astrology Blog</h1>
          <div className="divider" />
          <p className="section-subtitle">Explore articles on astrology, numerology, Vastu, and spiritual wisdom.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blogs-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`services-filter__btn ${activeCategory === cat ? 'services-filter__btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat !== 'All' && categoryEmoji[cat]} {cat}
              </button>
            ))}
          </div>

          {loading ? <div className="spinner" /> : (
            <div className="blogs-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card glass-card">
                  <div className="blog-card__image">
                    <div className="blog-card__image-placeholder">
                      <span>{categoryEmoji[blog.category] || '⭐'}</span>
                    </div>
                    <span className="badge badge-purple blog-card__category">{blog.category}</span>
                  </div>
                  <div className="blog-card__body">
                    <h3 className="blog-card__title">{blog.title}</h3>
                    <p className="blog-card__excerpt">{blog.excerpt}</p>
                    <div className="blog-card__meta">
                      <span><FaClock /> {fmt(blog.createdAt)}</span>
                      <span><FaEye /> {blog.views} views</span>
                    </div>
                    <Link to={`/blogs/${blog.slug}`} className="blog-card__link">
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
