import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Password strength calculator
function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };

  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
  if (score === 3) return { score: 3, label: 'Good', color: '#eab308' };
  if (score === 4) return { score: 4, label: 'Strong', color: '#22c55e' };
  return { score: 5, label: 'Excellent', color: '#16a34a' };
}

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);
  const passwordsMatch = form.confirm.length > 0 && form.password === form.confirm;
  const passwordsDiffer = form.confirm.length > 0 && form.password !== form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.name.trim().length < 2) {
      return setError('Name must be at least 2 characters');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError('Please enter a valid email');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    if (!agree) {
      return setError('Please accept the Terms & Privacy Policy');
    }

    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success(`Welcome to ShahidShop, ${user.name.split(' ')[0]}! 🎉`);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
                  <linearGradient id="regLogo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="14" fill="url(#regLogo)" />
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
              Join thousands of<br />
              <span className="gradient-text">happy shoppers.</span>
            </h1>
            <p>
              Create a free account to save your favorites, track orders,
              and get exclusive member-only deals.
            </p>
          </div>

          <ul className="auth-brand-perks">
            <li>
              <span className="auth-perk-check">✓</span>
              Free shipping on orders over $100
            </li>
            <li>
              <span className="auth-perk-check">✓</span>
              30-day easy returns on all products
            </li>
            <li>
              <span className="auth-perk-check">✓</span>
              Exclusive deals for members
            </li>
            <li>
              <span className="auth-perk-check">✓</span>
              Save your cart &amp; wishlist across devices
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
            <h2>Create your account</h2>
            <p className="muted">
              Already have one? <Link to="/login" className="link">Sign in</Link>
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
            {/* Name */}
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

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
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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

              {/* Strength meter */}
              {form.password.length > 0 && (
                <div className="pw-strength">
                  <div className="pw-strength-bar">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="pw-strength-seg"
                        style={{
                          background: n <= strength.score ? strength.color : 'var(--border)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="pw-strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="field">
              <label htmlFor="confirm">Confirm Password</label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  style={{
                    borderColor: passwordsMatch
                      ? 'var(--success)'
                      : passwordsDiffer
                      ? 'var(--error)'
                      : undefined,
                  }}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
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
              {passwordsMatch && (
                <p className="pw-match" style={{ color: 'var(--success)' }}>
                  ✓ Passwords match
                </p>
              )}
              {passwordsDiffer && (
                <p className="pw-match" style={{ color: 'var(--error)' }}>
                  ✕ Passwords don't match
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span className="auth-checkbox-box" />
              <span>
                I agree to the <a className="link" href="#" onClick={(e) => e.preventDefault()}>Terms</a> and{' '}
                <a className="link" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button className="btn btn-primary btn-full auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or sign up with</span>
          </div>

          {/* Socials (visual only) */}
          <div className="auth-socials">
            <button
              type="button"
              className="auth-social"
              onClick={() => toast.info('Google sign-up is not available in this demo')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="auth-social"
              onClick={() => toast.info('GitHub sign-up is not available in this demo')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}