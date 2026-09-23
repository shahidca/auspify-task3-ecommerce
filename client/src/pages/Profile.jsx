import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingScreen from '../components/LoadingScreen';

export default function Profile() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState('info'); // 'info' | 'password'
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Profile form
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }

    api.get('/orders/my')
      .then((res) => {
        const orders = res.data.data;
        const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
        setStats({ orders: orders.length, totalSpent: totalSpent.toFixed(2) });
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put('/auth/profile', form);
      toast.success('Profile updated');
      // Reload page so AuthContext picks up the new user data
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (pw.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSavingPw(true);
    try {
      await api.put('/auth/password', {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      toast.success('Password updated');
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPw(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
    navigate('/');
  };

  // ============ LOADING (only if user is missing) ============
  if (!user) {
    return <LoadingScreen message="Loading profile…" />;
  }

  return (
    <div className="page container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="page-title" style={{ marginBottom: 4 }}>{user.name}</h1>
          <p className="muted" style={{ fontSize: '0.9rem' }}>
            {user.email} · <span className="badge-role">{user.role}</span>
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      {/* Stats */}
      {loadingStats ? (
        <div className="profile-stats">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton" style={{ height: 88, borderRadius: 14 }} />
          ))}
        </div>
      ) : stats ? (
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">{stats.orders}</div>
            <div className="profile-stat-label">Orders</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">${stats.totalSpent}</div>
            <div className="profile-stat-label">Total Spent</div>
          </div>
          <Link to="/orders" className="profile-stat clickable">
            <div className="profile-stat-value">→</div>
            <div className="profile-stat-label">View Orders</div>
          </Link>
          <Link to="/wishlist" className="profile-stat clickable">
            <div className="profile-stat-value">♥</div>
            <div className="profile-stat-label">Wishlist</div>
          </Link>
        </div>
      ) : null}

      {/* Tabs */}
      <div className="profile-tabs">
        <button className={`profile-tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
          Personal Info
        </button>
        <button className={`profile-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
          Change Password
        </button>
      </div>

      {/* Info tab */}
      {tab === 'info' && (
        <form className="form-card" style={{ margin: 0, maxWidth: 520 }} onSubmit={handleProfileSave}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={user.email} disabled />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+880 1XXX XXXXXX"
            />
          </div>
          <div className="field">
            <label>Shipping Address</label>
            <textarea
              rows="3"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House, street, city, postal code, country"
            />
          </div>
          <button className="btn btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Password tab */}
      {tab === 'password' && (
        <form className="form-card" style={{ margin: 0, maxWidth: 520 }} onSubmit={handlePasswordSave}>
          <div className="field">
            <label>Current Password</label>
            <input
              type="password"
              value={pw.currentPassword}
              onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>New Password</label>
            <input
              type="password"
              value={pw.newPassword}
              onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
              required
              minLength="6"
            />
          </div>
          <div className="field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              required
            />
          </div>
          <button className="btn btn-primary" disabled={savingPw}>
            {savingPw ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}