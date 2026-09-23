import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/client';
import OrderTimeline from '../components/OrderTimeline';
import LoadingScreen from '../components/LoadingScreen';

const statusColors = {
  pending: '#f59e0b',
  paid: '#6366f1',
  shipped: '#3b82f6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slowServer, setSlowServer] = useState(false);
  const slowTimerRef = useRef(null);

  const loadOrder = () => {
    setLoading(true);
    setError('');
    setSlowServer(false);

    slowTimerRef.current = setTimeout(() => setSlowServer(true), 5000);

    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => {
        clearTimeout(slowTimerRef.current);
        setSlowServer(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrder();
    return () => clearTimeout(slowTimerRef.current);
    /* eslint-disable-next-line */
  }, [id]);

  const handlePrint = () => window.print();

  // ============ LOADING ============
  if (loading) {
    return (
      <LoadingScreen
        message={
          slowServer
            ? 'Waking up server… (first load can take 30 seconds)'
            : 'Loading your order…'
        }
      />
    );
  }

  // ============ ERROR ============
  if (error) {
    return (
      <div className="page container">
        <Link to="/orders" className="muted" style={{ display: 'inline-block', marginBottom: 20, fontSize: '0.9rem' }}>
          ← Back to orders
        </Link>
        <div className="alert alert-error">{error}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={loadOrder}>Try Again</button>
          <Link to="/orders" className="btn btn-outline">All Orders</Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = order.discount || 0;
  const shipping = order.totalAmount - subtotal + discount;

  return (
    <div className="page container">
      <div className="no-print">
        <Link to="/orders" className="muted" style={{ display: 'inline-block', marginBottom: 20, fontSize: '0.9rem' }}>
          ← Back to orders
        </Link>

        {justPlaced && (
          <div className="alert alert-success">🎉 Your order was placed successfully!</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>Order #{order.id}</h1>
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <span
              style={{
                background: `${statusColors[order.status]}22`,
                color: statusColors[order.status],
                padding: '6px 16px',
                borderRadius: 100,
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {order.status}
            </span>
            <button className="btn btn-outline btn-sm" onClick={handlePrint}>
              🖨️ Print Invoice
            </button>
          </div>
        </div>

        <div className="order-timeline-wrap">
          <OrderTimeline
            status={order.status}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
          />
        </div>
      </div>

      {/* Invoice body — printable */}
      <div className="invoice" id="invoice">
        <div className="invoice-header">
          <div>
            <h2 style={{ marginBottom: 4 }}>ShahidShop</h2>
            <p className="muted" style={{ fontSize: '0.85rem' }}>Modern E-Commerce</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Invoice</div>
            <div className="muted" style={{ fontSize: '0.85rem' }}>
              Order #{order.id}<br />
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="invoice-parties">
          <div>
            <div className="invoice-label">Billed To</div>
            <div style={{ fontWeight: 600 }}>{order.user.name}</div>
            <div className="muted" style={{ fontSize: '0.85rem' }}>{order.user.email}</div>
          </div>
          <div>
            <div className="invoice-label">Ship To</div>
            <div className="muted" style={{ fontSize: '0.85rem', maxWidth: 260 }}>
              {order.shippingAddress}
            </div>
          </div>
        </div>

        <div className="cart-list">
          {order.items.map((item) => {
            const cover = item.product.images?.[0];
            return (
              <div key={item.id} className="cart-item" style={{ gridTemplateColumns: '60px 1fr auto' }}>
                <div className="cart-item-image" style={{ width: 60, height: 60 }}>
                  {cover ? <img src={cover} alt="" /> : '📦'}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <span className="cart-item-price">${item.price.toFixed(2)} × {item.quantity}</span>
                </div>
                <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            );
          })}
        </div>

        <div className="invoice-totals">
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {discount > 0 && (
            <div className="summary-row" style={{ color: 'var(--success)' }}>
              <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
              <span style={{ color: 'var(--success)' }}>−${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping <= 0.01 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="invoice-footer">
          <p className="muted" style={{ fontSize: '0.8rem' }}>
            Thank you for your order! · shahidca.github.io · mdshahidca123@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}