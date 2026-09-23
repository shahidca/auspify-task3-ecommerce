import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CouponInput from '../components/CouponInput';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, refresh } = useCart();
  const toast = useToast();

  const [address, setAddress] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const discount = coupon?.discount || 0;
  const total = subtotal - discount + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address.trim().length < 5) {
      toast.error('Please enter a valid shipping address');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        shippingAddress: address.trim(),
        couponCode: coupon?.code || undefined,
      });
      await refresh();
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.data.id}`, { state: { justPlaced: true } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty">
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>🛒</p>
          <p style={{ marginBottom: 20 }}>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="page-title">Checkout</h1>

      <div className="cart-layout">
        <form onSubmit={handleSubmit} className="form-card" style={{ margin: 0, maxWidth: 'none' }}>
          <h2 style={{ fontSize: '1.15rem', textAlign: 'left', marginBottom: 20 }}>Shipping Details</h2>

          <div className="field">
            <label>Shipping Address *</label>
            <textarea
              rows="4"
              required
              placeholder="House, street, city, postal code, country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Payment Method</label>
            <input type="text" value="Cash on Delivery (demo)" disabled />
          </div>

          <div className="field">
            <label>Have a coupon?</label>
            <CouponInput subtotal={subtotal} applied={coupon} onApply={setCoupon} />
          </div>

          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Placing order...' : `Place Order · $${total.toFixed(2)}`}
          </button>
        </form>

        <aside className="cart-summary">
          <h3>Order Summary</h3>

          <div className="cart-list" style={{ gap: 10, marginBottom: 20 }}>
            {items.map((item) => {
              const cover = item.product.images?.[0];
              return (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div className="cart-item-image" style={{ width: 50, height: 50, fontSize: '1.2rem' }}>
                    {cover ? <img src={cover} alt="" /> : '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.product.name}
                    </div>
                    <div className="muted" style={{ fontSize: '0.75rem' }}>× {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {coupon && (
            <div className="summary-row" style={{ color: 'var(--success)' }}>
              <span>Discount ({coupon.code})</span>
              <span style={{ color: 'var(--success)' }}>−${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}