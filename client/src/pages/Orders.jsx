import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const statusColors = {
  pending: '#f59e0b',
  paid: '#6366f1',
  shipped: '#3b82f6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/my')
      .then((res) => setOrders(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page container"><div className="loading">Loading orders...</div></div>;
  if (error) return <div className="page container"><div className="alert alert-error">{error}</div></div>;

  if (orders.length === 0) {
    return (
      <div className="page container">
        <h1 className="page-title">My Orders</h1>
        <div className="empty">
          <p style={{ fontSize: '3rem', marginBottom: 12 }}>📦</p>
          <p style={{ marginBottom: 20 }}>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="page-title">My Orders ({orders.length})</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700 }}>Order #{o.id}</div>
                <div className="muted" style={{ fontSize: '0.85rem' }}>
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: `${statusColors[o.status] || '#888'}22`,
                    color: statusColors[o.status] || '#888',
                    padding: '4px 12px',
                    borderRadius: 100,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {o.status}
                </span>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 4 }}>
                  ${o.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              {o.items.map((item) => {
                const cover = item.product.images?.[0];
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: 8,
                      fontSize: '0.85rem',
                    }}
                  >
                    <div className="cart-item-image" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                      {cover ? <img src={cover} alt="" /> : '📦'}
                    </div>
                    <span>{item.product.name}</span>
                    <span className="muted">× {item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className="muted" style={{ fontSize: '0.85rem', marginBottom: 14 }}>
              <strong style={{ color: 'var(--text)' }}>Ship to:</strong> {o.shippingAddress}
            </div>

            <Link to={`/orders/${o.id}`} className="btn btn-outline btn-sm">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}