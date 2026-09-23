import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyForm = {
  name: '', description: '', price: '', category: '', stock: '',
  images: [''],
  featured: false,
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', { params: { sort: 'newest' } });
      setProducts(res.data.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data);
    } catch (err) { setError(err.message); }
  };

  const loadStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) { /* stats optional */ }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadStats();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (idx, value) => {
    const next = [...form.images];
    next[idx] = value;
    setForm({ ...form, images: next });
  };

  const addImageField = () => {
    if (form.images.length >= 5) return;
    setForm({ ...form, images: [...form.images, ''] });
  };

  const removeImageField = (idx) => {
    const next = form.images.filter((_, i) => i !== idx);
    setForm({ ...form, images: next.length ? next : [''] });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const cleanImages = form.images.map((s) => s.trim()).filter(Boolean);
      if (cleanImages.length === 0) {
        setError('At least one image URL is required');
        setSaving(false);
        return;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category.trim(),
        stock: parseInt(form.stock, 10),
        images: cleanImages,
        featured: !!form.featured,
      };

      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);

      resetForm();
      await loadProducts();
      await loadStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      images: p.images?.length ? p.images : [''],
      featured: !!p.featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      await loadProducts();
      await loadStats();
    } catch (err) { setError(err.message); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      await loadOrders();
      await loadStats();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="page container">
      <h1 className="page-title">Admin Dashboard</h1>

      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 28,
          }}
        >
          {[
            { label: 'Products', value: stats.totalProducts, color: '#6366f1' },
            { label: 'Users', value: stats.totalUsers, color: '#22d3ee' },
            { label: 'Orders', value: stats.totalOrders, color: '#f59e0b' },
            { label: 'Revenue', value: `$${stats.totalRevenue}`, color: '#22c55e' },
            { label: 'Pending', value: stats.pendingOrders, color: '#ef4444' },
            { label: 'Low stock', value: stats.lowStockProducts, color: '#f472b6' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 18,
              }}
            >
              <div className="muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, marginTop: 6 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          className={`btn ${tab === 'products' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={`btn ${tab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {tab === 'products' && (
        <>
          <form onSubmit={handleSubmit} className="form-card" style={{ margin: '0 0 28px', maxWidth: 'none' }}>
            <h2 style={{ fontSize: '1.15rem', textAlign: 'left', marginBottom: 20 }}>
              {editingId ? `Edit Product #${editingId}` : 'Add New Product'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Name *</label>
                <input name="name" required value={form.name} onChange={handleChange} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Category *</label>
                <input name="category" required value={form.category} onChange={handleChange} placeholder="Electronics" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Price ($) *</label>
                <input name="price" type="number" step="0.01" min="0" required value={form.price} onChange={handleChange} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Stock *</label>
                <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange} />
              </div>
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label>Product Images (1–5 URLs)</label>
              <div className="image-editor">
                {form.images.map((url, idx) => (
                  <div key={idx} className="image-row">
                    <div className="image-preview">
                      {url ? <img src={url} alt="" onError={(e) => (e.target.style.display = 'none')} /> : '🖼️'}
                    </div>
                    <input
                      type="url"
                      placeholder={`Image ${idx + 1} URL`}
                      value={url}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeImageField(idx)}
                      disabled={form.images.length === 1}
                    >×</button>
                  </div>
                ))}
                {form.images.length < 5 && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={addImageField}>
                    + Add another image
                  </button>
                )}
              </div>
            </div>

            <div className="field">
              <label>Description *</label>
              <textarea name="description" rows="3" required value={form.description} onChange={handleChange} />
            </div>

            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                Featured on homepage
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Img</th>
                    <th style={{ padding: 12 }}>ID</th>
                    <th style={{ padding: 12 }}>Name</th>
                    <th style={{ padding: 12 }}>Category</th>
                    <th style={{ padding: 12 }}>Price</th>
                    <th style={{ padding: 12 }}>Stock</th>
                    <th style={{ padding: 12 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12 }}>
                        <div className="image-preview" style={{ width: 40, height: 40 }}>
                          {p.images?.[0] ? <img src={p.images[0]} alt="" /> : '📦'}
                        </div>
                      </td>
                      <td style={{ padding: 12 }}>#{p.id}</td>
                      <td style={{ padding: 12 }}>{p.name}</td>
                      <td style={{ padding: 12 }} className="muted">{p.category}</td>
                      <td style={{ padding: 12 }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: 12 }}>{p.stock}</td>
                      <td style={{ padding: 12 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {orders.length === 0 ? (
            <div className="empty">No orders yet.</div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: 20,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Order #{o.id}</div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>
                      {o.user.name} · {o.user.email}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>
                      {o.items.length} item(s) · ${o.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                      Change status
                    </label>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      style={{
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        color: 'var(--text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="muted" style={{ fontSize: '0.85rem', marginTop: 10 }}>
                  <strong style={{ color: 'var(--text)' }}>Ship to:</strong> {o.shippingAddress}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}