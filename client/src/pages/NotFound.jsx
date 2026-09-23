import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-orb error-orb-1" aria-hidden="true" />
      <div className="error-orb error-orb-2" aria-hidden="true" />

      <div className="error-page-content">
        <div className="error-icon error-icon-404">
          <span>🔍</span>
        </div>

        <span className="error-code">404</span>
        <h1 className="error-title">Page not found</h1>
        <p className="error-message">
          The page you're looking for doesn't exist, was moved, or is temporarily unavailable.
        </p>

        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Go Home
          </Link>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>

        <div className="error-links">
          <span className="muted">Popular pages:</span>
          <Link to="/products" className="link">Products</Link>
          <Link to="/cart" className="link">Cart</Link>
          <Link to="/orders" className="link">Orders</Link>
          <Link to="/wishlist" className="link">Wishlist</Link>
        </div>
      </div>
    </div>
  );
}