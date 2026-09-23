import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../context/ToastContext';

// =========================================================
// CATEGORY MAPPING — semantic color + icon per category
// =========================================================
const CATEGORY_STYLES = {
  Electronics: { grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)', icon: '💻' },
  Fashion:     { grad: 'linear-gradient(135deg,#ec4899,#8b5cf6)', icon: '👕' },
  Home:        { grad: 'linear-gradient(135deg,#10b981,#84cc16)', icon: '🏠' },
  Sports:      { grad: 'linear-gradient(135deg,#f97316,#ef4444)', icon: '⚽' },
  Books:       { grad: 'linear-gradient(135deg,#b45309,#78350f)', icon: '📚' },
  Beauty:      { grad: 'linear-gradient(135deg,#f472b6,#fb7185)', icon: '💄' },
  Toys:        { grad: 'linear-gradient(135deg,#facc15,#f97316)', icon: '🧸' },
};

const FALLBACK = { grad: 'linear-gradient(135deg,#6366f1,#22d3ee)', icon: '🛍️' };

const getCategoryStyle = (name) => CATEGORY_STYLES[name] || FALLBACK;

// =========================================================
// ANIMATED COUNTER
// =========================================================
function AnimatedNumber({ target, suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(eased * target));
          if (p < 1) requestAnimationFrame(tick);
          else setVal(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });

    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// =========================================================
// COUNTDOWN TIMER
// =========================================================
function Countdown() {
  const [time, setTime] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    return {
      h: Math.floor(diff / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1000),
    };
  }

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="countdown">
      <div className="countdown-unit">
        <span className="countdown-num">{pad(time.h)}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{pad(time.m)}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{pad(time.s)}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  );
}

// =========================================================
// FAQ ITEM
// =========================================================
function FaqItem({ q, a, open, onClick }) {
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={onClick}>
        <span>{q}</span>
        <svg
          className="faq-chevron"
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
}

// =========================================================
// HOME
// =========================================================
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const toast = useToast();

  useEffect(() => {
    api.get('/products', { params: { featured: 'true' } })
      .then((res) => setFeatured(res.data.data.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));

    api.get('/products', { params: { sort: 'newest' } })
      .then((res) => setNewArrivals(res.data.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoadingNew(false));

    api.get('/products', { params: { sort: 'price_desc' } })
      .then((res) => {
        // treat top-rated as trending
        const sorted = [...res.data.data]
          .sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0))
          .slice(0, 4);
        setTrending(sorted);
      })
      .catch(() => {})
      .finally(() => setLoadingTrending(false));

    api.get('/products/categories')
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('Subscribed! Check your inbox (demo only)');
    setNewsletterEmail('');
  };

  const dealProduct = featured[0];

  const FAQS = [
    {
      q: 'How long does shipping take?',
      a: 'Standard shipping takes 3–5 business days. Express options are available at checkout. Orders over $100 ship free.',
    },
    {
      q: 'What is your return policy?',
      a: 'Every product comes with a 30-day return window. If you are not happy, send it back for a full refund — no questions asked.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes! We ship to over 40 countries. International shipping rates and delivery times are calculated at checkout.',
    },
    {
      q: 'How do I track my order?',
      a: 'Every order gets a tracking number. You can track it from your account → My Orders page with live status updates.',
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept all major credit cards, debit cards, and mobile wallets. All payments are secured with industry-standard encryption.',
    },
  ];

  return (
    <div>
      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="home-hero">
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div className="hero-orb hero-orb-3" aria-hidden="true" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-pill">
              <span className="hero-pill-dot" />
              Free shipping over $100
            </span>

            <h1 className="hero-heading">
              Everything you need,<br />
              <span className="gradient-text">delivered fast.</span>
            </h1>

            <p className="hero-lead">
              Shop a curated catalog of electronics, fashion, home goods, and more.
              Built with React, Express, PostgreSQL & Prisma.
            </p>

            <div className="hero-cta-row">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop All Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link to="/products?featured=true" className="btn btn-outline btn-lg">
                View Featured
              </Link>
            </div>

            <div className="hero-trust">
              {[
                { n: 42, s: '+', label: 'Products' },
                { n: 7, s: '', label: 'Categories' },
                { n: 24, s: '/7', label: 'Support' },
              ].map((t) => (
                <div key={t.label} className="hero-trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>
                    <strong className="hero-trust-num">
                      <AnimatedNumber target={t.n} suffix={t.s} />
                    </strong>{' '}
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-stack">
            {featured.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="hero-card"
                style={{
                  transform: `rotate(${(i - 1) * 5}deg) translateX(${(i - 1) * 40}px)`,
                  zIndex: 3 - i,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.name} loading="eager" />
                )}
                <div className="hero-card-body">
                  <div className="hero-card-name">{p.name}</div>
                  <div className="hero-card-price">${p.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ============================================================
          MARQUEE
          ============================================================ */}
      <div className="brand-marquee" aria-hidden="true">
        <div className="brand-marquee-track">
          {[
            'Free Shipping', '•', 'Secure Checkout', '•',
            '30-Day Returns', '•', 'Fast Delivery', '•',
            'Curated Catalog', '•', 'Local Support', '•',
            'Free Shipping', '•', 'Secure Checkout', '•',
            '30-Day Returns', '•', 'Fast Delivery', '•',
            'Curated Catalog', '•', 'Local Support', '•',
          ].map((s, i) => (
            <span key={i} className={s === '•' ? 'brand-marquee-dot' : ''}>{s}</span>
          ))}
        </div>
      </div>

      {/* ============================================================
          TRUST ROW
          ============================================================ */}
      <section className="container" style={{ paddingTop: 40 }}>
        <div className="trust-row">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'JWT + bcrypt encryption' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return window' },
            { icon: '💬', title: 'Live Support', desc: 'We reply within hours' },
          ].map((t, i) => (
            <div key={t.title} className="trust-badge" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="trust-badge-icon">{t.icon}</div>
              <div>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          NEW — DEAL OF THE DAY
          ============================================================ */}
      {dealProduct && (
        <section className="container" style={{ paddingTop: 80 }}>
          <div className="deal-banner">
            <div className="deal-orb deal-orb-1" aria-hidden="true" />
            <div className="deal-orb deal-orb-2" aria-hidden="true" />

            <div className="deal-content">
              <span className="deal-tag">🔥 Deal of the Day</span>
              <h2 className="deal-title">{dealProduct.name}</h2>
              <p className="deal-desc">{dealProduct.description}</p>

              <div className="deal-price-row">
                <span className="deal-price">${dealProduct.price.toFixed(2)}</span>
                <span className="deal-price-old">
                  ${(dealProduct.price * 1.35).toFixed(2)}
                </span>
                <span className="deal-price-save">Save 35%</span>
              </div>

              <div className="deal-countdown-wrap">
                <span className="deal-countdown-label">⏱️ Ends in</span>
                <Countdown />
              </div>

              <Link to={`/products/${dealProduct.id}`} className="btn btn-lg deal-btn">
                Claim This Deal
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>

            <Link to={`/products/${dealProduct.id}`} className="deal-image">
              {dealProduct.images?.[0] && <img src={dealProduct.images[0]} alt={dealProduct.name} />}
              <span className="deal-discount-badge">-35%</span>
            </Link>
          </div>
        </section>
      )}

      {/* ============================================================
          CATEGORY CARDS
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="home-section-head">
          <div>
            <span className="section-eyebrow">Explore</span>
            <h2 className="home-section-title">Shop by Category</h2>
            <p className="muted">Browse what you love</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((c) => {
            const style = getCategoryStyle(c.name);
            return (
              <Link
                key={c.name}
                to={`/products?category=${c.name}`}
                className="category-card"
                style={{ '--grad-1': style.grad }}
              >
                <div className="category-card-bg-icon">{style.icon}</div>
                <div className="category-card-inner">
                  <div className="category-card-icon">{style.icon}</div>
                  <div className="category-card-name">{c.name}</div>
                  <div className="category-card-count">{c.count} product{c.count !== 1 ? 's' : ''}</div>
                </div>
                <div className="category-card-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          FEATURED PRODUCTS
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="home-section-head">
          <div>
            <span className="section-eyebrow">Bestsellers</span>
            <h2 className="home-section-title">Featured Products</h2>
            <p className="muted">Hand-picked favourites from our catalog</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            See all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <div className="products-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ============================================================
          NEW — NEW ARRIVALS
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="home-section-head">
          <div>
            <span className="section-eyebrow">Just landed</span>
            <h2 className="home-section-title">New Arrivals</h2>
            <p className="muted">Fresh drops, straight from the source</p>
          </div>
          <Link to="/products?sort=newest" className="btn btn-outline btn-sm">
            See all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        {loadingNew ? (
          <div className="products-grid">
            {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <div className="products-grid">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ============================================================
          NEW — TRENDING
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="home-section-head">
          <div>
            <span className="section-eyebrow">🔥 Hot right now</span>
            <h2 className="home-section-title">Trending Products</h2>
            <p className="muted">Top-rated by real customers</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            See all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        {loadingTrending ? (
          <div className="products-grid">
            {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <div className="products-grid">
            {trending.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ============================================================
          PROMO BANNER
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="promo-banner">
          <div className="promo-orb promo-orb-1" aria-hidden="true" />
          <div className="promo-orb promo-orb-2" aria-hidden="true" />

          <div className="promo-content">
            <span className="promo-tag">Limited Time</span>
            <h3>Spring Sale — up to 40% off</h3>
            <p>Stock is going fast. Grab your favorites before they're gone.</p>
          </div>

          <Link to="/products" className="btn promo-btn">
            Shop Deals
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>

      {/* ============================================================
          STATS BAND
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="stats-band">
          {[
            { target: 42, suffix: '+', label: 'Products' },
            { target: 7, suffix: '', label: 'Categories' },
            { target: 48, suffix: '★', label: 'Avg Rating' },
            { target: 24, suffix: '/7', label: 'Support' },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">
                <AnimatedNumber target={s.target} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          NEW — PRESS LOGOS
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="press-strip">
          <p className="press-label">As featured in</p>
          <div className="press-logos">
            {['Forbes', 'TechCrunch', 'Wired', 'The Daily Star', 'Product Hunt', 'Hacker News'].map((name) => (
              <span key={name} className="press-logo">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="home-section-head">
          <div>
            <span className="section-eyebrow">Testimonials</span>
            <h2 className="home-section-title">Loved by Customers</h2>
            <p className="muted">Real reviews from real shoppers</p>
          </div>
        </div>

        <div className="testimonial-grid">
          {[
            { name: 'Ayesha Rahman', role: 'Verified Buyer', text: 'Fast shipping, great quality. The checkout flow was seamless.', rating: 5 },
            { name: 'Rakib Hasan', role: 'Verified Buyer', text: 'Best online shopping experience I\'ve had in a while. Highly recommend.', rating: 5 },
            { name: 'Nusrat Jahan', role: 'Verified Buyer', text: 'Love the UI. And the product photos are so helpful when deciding.', rating: 4 },
          ].map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-quote" aria-hidden="true">"</div>
              <div className="testimonial-stars">
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.name[0]}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          NEW — FAQ
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="home-section-head">
          <div>
            <span className="section-eyebrow">FAQ</span>
            <h2 className="home-section-title">Frequently Asked</h2>
            <p className="muted">Quick answers to common questions</p>
          </div>
        </div>

        <div className="faq-grid">
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={openFaq === i}
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* ============================================================
          NEW — MOBILE APP PROMO
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80 }}>
        <div className="app-promo">
          <div className="app-promo-content">
            <span className="app-promo-tag">📱 Coming soon</span>
            <h2>Shop faster on the go</h2>
            <p>
              Get the ShahidShop mobile app for exclusive mobile-only deals,
              push notifications, and one-tap checkout.
            </p>
            <div className="app-store-row">
              <span className="app-store-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </span>
              </span>
              <span className="app-store-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zM14.5 12.707l2.302 2.302-10.937 6.333 8.635-8.635zM17.75 9.06l3.148 1.826a1 1 0 010 1.73l-3.148 1.826L14.9 12l2.85-2.94zM5.865 2.658L16.802 8.99 14.5 11.293 5.865 2.658z" />
                </svg>
                <span>
                  <small>Get it on</small>
                  <strong>Google Play</strong>
                </span>
              </span>
            </div>
          </div>

          <div className="app-promo-visual">
            <div className="app-phone">
              <div className="app-phone-screen">
                <div className="app-phone-bar" />
                <div className="app-phone-tile" />
                <div className="app-phone-tile" />
                <div className="app-phone-tile" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          NEWSLETTER
          ============================================================ */}
      <section className="container" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="newsletter">
          <div className="newsletter-orb" aria-hidden="true" />

          <span className="newsletter-badge">🎁 Save 10%</span>
          <h2>Get 10% off your first order</h2>
          <p>Subscribe to our newsletter for exclusive deals and early access</p>

          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="you@example.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Subscribe
            </button>
          </form>

          <p className="newsletter-note">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}