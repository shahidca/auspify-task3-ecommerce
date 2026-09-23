import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import Breadcrumbs from '../components/Breadcrumbs';
import ShareButtons from '../components/ShareButtons';
import ProductCard from '../components/ProductCard';
import LoadingScreen from '../components/LoadingScreen';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const { add: addRecent } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slowServer, setSlowServer] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewSaving, setReviewSaving] = useState(false);

  const slowTimerRef = useRef(null);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    setSlowServer(false);

    // Show "waking up" message if backend takes > 5 seconds
    slowTimerRef.current = setTimeout(() => setSlowServer(true), 5000);

    try {
      const [pRes, rRes, relRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/${id}/reviews`),
        api.get(`/products/${id}/related`).catch(() => ({ data: { data: [] } })),
      ]);
      setProduct(pRes.data.data);
      setReviews(rRes.data.data);
      setReviewStats({ average: rRes.data.average, count: rRes.data.count });
      setRelated(relRes.data.data || []);
      setActiveImage(0);
      addRecent(pRes.data.data.id);
    } catch (err) {
      setError(err.message);
    } finally {
      clearTimeout(slowTimerRef.current);
      setSlowServer(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => clearTimeout(slowTimerRef.current);
    /* eslint-disable-next-line */
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please log in to add items');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.info('Please log in to save items');
      navigate('/login');
      return;
    }
    try {
      const added = await toggle(product.id);
      toast.success(added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to write a review');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    setReviewSaving(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review saved');
      await loadAll();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReviewSaving(false);
    }
  };

  // ============ LOADING ============
  if (loading) {
    return (
      <LoadingScreen
        message={
          slowServer
            ? 'Waking up server… (first load can take 30 seconds)'
            : 'Loading product…'
        }
      />
    );
  }

  // ============ ERROR ============
  if (error) {
    return (
      <div className="page container">
        <div className="alert alert-error">{error}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={loadAll}>Try Again</button>
          <Link to="/products" className="btn btn-outline">Back to Products</Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock === 0;
  const images = product.images?.length ? product.images : [];
  const myReview = reviews.find((r) => r.user.id === user?.id);
  const liked = has(product.id);

  return (
    <div className="page container">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          { label: product.category, to: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="product-detail">
        <div className="product-gallery">
          <div className="gallery-main">
            {images.length > 0 ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <div className="product-image-placeholder" style={{ fontSize: '6rem' }}>📦</div>
            )}

            <button className={`wishlist-btn lg ${liked ? 'active' : ''}`} onClick={handleWishlist}>
              {liked ? '♥' : '♡'}
            </button>

            {images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}>‹</button>
                <button className="gallery-nav next" onClick={() => setActiveImage((i) => (i + 1) % images.length)}>›</button>
                <div className="gallery-counter">{activeImage + 1} / {images.length}</div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  className={`gallery-thumb ${idx === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1>{product.name}</h1>

          {reviewStats.count > 0 && (
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#facc15' }}>
                {'★'.repeat(Math.round(reviewStats.average))}{'☆'.repeat(5 - Math.round(reviewStats.average))}
              </span>{' '}
              <span className="muted" style={{ fontSize: '0.9rem' }}>
                {reviewStats.average} · {reviewStats.count} review{reviewStats.count !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="product-detail-price">${product.price.toFixed(2)}</div>
          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-meta">
            <div>
              <strong>Stock</strong>
              {outOfStock
                ? <span style={{ color: 'var(--error)' }}>Out of stock</span>
                : <span style={{ color: 'var(--success)' }}>{product.stock} available</span>}
            </div>
            <div><strong>Category</strong>{product.category}</div>
          </div>

          {!outOfStock && (
            <div className="quantity-selector">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
            </div>
          )}

          <div className="product-actions">
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={outOfStock || adding}>
              {outOfStock ? 'Out of Stock' : adding ? 'Adding...' : '🛒 Add to Cart'}
            </button>
            <Link to="/cart" className="btn btn-outline">View Cart</Link>
          </div>

          <div style={{ marginTop: 20 }}>
            <ShareButtons title={product.name} />
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ marginTop: 60 }}>
          <h2 className="home-section-title" style={{ marginBottom: 20 }}>You may also like</h2>
          <div className="products-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section style={{ marginTop: 60 }}>
        <h2 className="page-title" style={{ fontSize: '1.4rem' }}>Customer Reviews</h2>

        <div className="reviews-grid">
          <div>
            {reviews.length === 0 ? (
              <div className="empty">No reviews yet. Be the first to review!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: 18,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <strong>{r.user.name}</strong>
                        <div className="muted" style={{ fontSize: '0.8rem' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span style={{ color: '#facc15' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p className="muted" style={{ fontSize: '0.95rem' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-card" style={{ margin: 0, maxWidth: 'none' }}>
            <h3 style={{ marginBottom: 16, fontSize: '1.05rem' }}>
              {myReview ? 'Update your review' : 'Write a review'}
            </h3>

            <form onSubmit={handleReviewSubmit}>
              <div className="field">
                <label>Rating</label>
                <div style={{ display: 'flex', gap: 4, fontSize: '1.8rem', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                      style={{ color: n <= reviewForm.rating ? '#facc15' : 'var(--border)' }}>★</span>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Comment</label>
                <textarea rows="3" required value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your thoughts..." />
              </div>

              <button className="btn btn-primary btn-full" disabled={reviewSaving}>
                {reviewSaving ? 'Saving...' : myReview ? 'Update Review' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}