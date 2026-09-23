import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

export default function Cart() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart, loading } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const [updatingId, setUpdatingId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Free shipping progress
  const FREE_SHIPPING_THRESHOLD = 100;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const total = subtotal + shipping;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  // Load cross-sell suggestions
  useEffect(() => {
    if (items.length === 0) {
      api.get('/products', { params: { sort: 'newest' } })
        .then((res) => setSuggestions(res.data.data.slice(0, 4)))
        .catch(() => {});
    } else {
      const inCartIds = new Set(items.map((i) => i.product.id));
      api.get('/products', { params: { sort: 'newest' } })
        .then((res) => {
          const filtered = res.data.data
            .filter((p) => !inCartIds.has(p.id))
            .slice(0, 4);
          setSuggestions(filtered);
        })
        .catch(() => {});
    }
  }, [items]);

  const handleQty = async (productId, newQty) => {
    setUpdatingId(productId);
    try {
      await updateQuantity(productId, newQty);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId, name) => {
    setUpdatingId(productId);
    try {
      await removeItem(productId);
      toast.success(`Removed "${name}" from cart`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClear = async () => {
    if (!confirm('Clear entire cart?')) return;
    try {
      await clearCart();
      toast.info('Cart cleared');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---------- Loading ----------
  if (loading && items.length === 0) {
    return (
      <div className="page container">
        <h1 className="page-title">Your Cart</h1>
        <div className="cart-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: 130, borderRadius: 14 }} />
          ))}
        </div>
      </div>
    );
  }

  // ---------- Empty state ----------
  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p className="muted">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {suggestions.length > 0 && (
          <section style={{ marginTop: 60 }}>
            <div className="home-section-head">
              <div>
                <span className="section-eyebrow">Popular right now</span>
                <h2 className="home-section-title">You may also like</h2>
              </div>
            </div>
            <div className="products-grid">
              {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ---------- Filled cart ----------
  return (
    <div className="page container">
      <div className="cart-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Your Cart</h1>
          <p className="muted" style={{ fontSize: '0.9rem' }}>
            {itemCount} item{itemCount !== 1 ? 's' : ''} · ${subtotal.toFixed(2)} subtotal
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleClear}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          </svg>
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        {/* ============ ITEMS ============ */}
        <div className="cart-list">
          {items.map((item) => {
            const p = item.product;
            const busy = updatingId === p.id;
            const cover = p.images?.[0];
            const lineTotal = p.price * item.quantity;

            return (
              <div key={item.id} className={`cart-item ${busy ? 'busy' : ''}`}>
                <Link to={`/products/${p.id}`} className="cart-item-image">
                  {cover ? <img src={cover} alt={p.name} /> : '📦'}
                </Link>

                <div className="cart-item-info">
                  <Link to={`/products/${p.id}`} className="cart-item-category">
                    {p.category}
                  </Link>
                  <Link to={`/products/${p.id}`} className="cart-item-name">
                    {p.name}
                  </Link>

                  <div className="cart-item-price-row">
                    <span className="cart-item-price">${p.price.toFixed(2)} each</span>
                    {p.stock < 5 && (
                      <span className="cart-item-stock">
                        Only {p.stock} left
                      </span>
                    )}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-item-total">${lineTotal.toFixed(2)}</div>

                  <div className="quantity-selector">
                    <button
                      onClick={() => handleQty(p.id, item.quantity - 1)}
                      disabled={busy || item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQty(p.id, item.quantity + 1)}
                      disabled={busy || item.quantity >= p.stock}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(p.id, p.name)}
                    disabled={busy}
                    title="Remove from cart"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    {busy ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============ SUMMARY ============ */}
        <aside className="cart-summary">
          <h3>Order Summary</h3>

          {/* Free shipping progress */}
          {shipping > 0 ? (
            <div className="ship-progress">
              <div className="ship-progress-head">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>
                  Add <strong>${remaining.toFixed(2)}</strong> more for <strong>free shipping</strong>
                </span>
              </div>
              <div className="ship-progress-bar">
                <div
                  className="ship-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="ship-progress unlocked">
              <div className="ship-progress-head">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>🎉 You've unlocked <strong>free shipping</strong>!</span>
              </div>
            </div>
          )}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          <Link to="/products" className="btn btn-outline btn-full" style={{ marginTop: 10 }}>
            Continue Shopping
          </Link>

          <div className="cart-trust">
            <div className="cart-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Secure checkout
            </div>
            <div className="cart-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              30-day returns
            </div>
          </div>
        </aside>
      </div>

      {/* ============ CROSS-SELL ============ */}
      {suggestions.length > 0 && (
        <section style={{ marginTop: 60 }}>
          <div className="home-section-head">
            <div>
              <span className="section-eyebrow">Frequently bought together</span>
              <h2 className="home-section-title">Add these to your order</h2>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              See all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          <div className="products-grid">
            {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}