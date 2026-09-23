import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (email, password) => {
    setForm({ email, password });
    setError('');
  };

  return (
    <div className="auth-page">
      {/* ============ LEFT — BRAND PANEL ============ */}
      <aside className="auth-brand">
        <div className="auth-brand-orb auth-brand-orb-1" aria-hidden="true" />
        <div className="auth-brand-orb auth-brand-orb-2" aria-hidden="true" />

        <div className="auth-brand-inner">
          <Link to="/" className="auth-brand-logo">
            <span className="logo-mark">
              <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
                <defs>
                  <linearGradient id="authLogo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="14" fill="url(#authLogo)" />
                <path
                  d="M22 40c0 2.5 2.2 4 5.5 4s5.5-1.4 5.5-3.7c0-2.2-1.6-3.2-5-4-4.5-1-7-2.6-7-6.2C21 26.5 24 24 28.5 24c4 0 7 1.6 7.5 4.6l-3.5 1c-.3-1.6-1.8-2.6-4-2.6-2.2 0-3.6 1-3.6 2.4 0 1.6 1.5 2.3 5 3.2 4.4 1.1 7 2.7 7 6.5 0 4.2-3.4 6.9-8.4 6.9-4.8 0-8-2.2-8.4-5.7L22 40z"
                  fill="#fff"
                />
              </svg>
            </span>
            <span className="auth-brand-text">ShahidShop</span>
          </Link>

          <div className="auth-brand-copy">
            <h1>
              Welcome back to<br />
              <span className="gradient-text">your favorite store.</span>
            </h1>
            <p>
              Sign in to track your orders, manage your wishlist,
              and check out faster.
            </p>
          </div>

          <ul className="auth-brand-perks">
            <li>
              <span className="auth-perk-check">✓</span>
              42+ products across 7 categories
            </li>
            <li>
              <span className="auth-perk-check">✓</span>
              Secure JWT authentication
            </li>
            <li>
              <span className="auth-perk-check">✓</span>
              Free shipping over $100
            </li>
          </ul>

          <div className="auth-brand-footer">
            <div className="auth-avatars">
              <span>A</span><span>R</span><span>N</span><span>+</span>
            </div>
            <p>Join 10,000+ happy shoppers</p>
          </div>
        </div>
      </aside>

      {/* ============ RIGHT — FORM PANEL ============ */}
      <main className="auth-form-wrap">
        <div className="auth-form-card">
          <div className="auth-form-head">
            <h2>Sign in</h2>
            <p className="muted">
              New here? <Link to="/register" className="link">Create an account</Link>
            </p>
          </div>

          {error && (
            <div className="alert alert-error auth-alert" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="field">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <div className="field-head">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="field-link"
                  onClick={() => toast.info('Password reset is not available in this demo')}
                >
                  Forgot?
                </button>
              </div>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="auth-checkbox-box" />
              <span>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button className="btn btn-primary btn-full auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>


          {/* Social OAuth */}
          <div className="auth-socials">
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
              className="auth-social"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              Continue with Google
            </a>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`}
              className="auth-social"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
              Continue with GitHub
            </a>
          </div>

          {/* Demo accounts */}
          <div className="auth-demo">
            <div className="auth-demo-head">
              <span>🧪 Try a demo account</span>
            </div>
            <div className="auth-demo-actions">
              <button
                type="button"
                className="auth-demo-btn"
                onClick={() => quickFill('shahid@example.com', 'customer123')}
              >
                <span className="auth-demo-avatar" style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)' }}>S</span>
                <span className="auth-demo-info">
                  <strong>Customer</strong>
                  <span className="muted">shahid@example.com</span>
                </span>
              </button>
              <button
                type="button"
                className="auth-demo-btn"
                onClick={() => quickFill('admin@shop.com', 'admin123')}
              >
                <span className="auth-demo-avatar" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>A</span>
                <span className="auth-demo-info">
                  <strong>Admin</strong>
                  <span className="muted">admin@shop.com</span>
                </span>
              </button>
            </div>
            <p className="auth-demo-note">Click to auto-fill · then press Sign In</p>
          </div>
        </div>
      </main>
    </div>
  );
}