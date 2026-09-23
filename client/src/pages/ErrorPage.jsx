import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const MESSAGES = {
  default: {
    title: 'Something went wrong',
    message: "We're having trouble loading this page. Please try again.",
  },
  network: {
    title: 'Connection error',
    message: "We couldn't reach the server. Check your internet connection.",
  },
  server: {
    title: 'Server error',
    message: 'The server is temporarily unavailable. Try again in a moment.',
  },
  maintenance: {
    title: 'Down for maintenance',
    message: "We're upgrading things. We'll be back very soon.",
  },
};

export default function ErrorPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const type = params.get('type') || 'default';
  const config = MESSAGES[type] || MESSAGES.default;

  return (
    <div className="error-page">
      <div className="error-orb error-orb-1" aria-hidden="true" />
      <div className="error-orb error-orb-2" aria-hidden="true" />

      <div className="error-page-content">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <span className="error-code">Oops</span>
        <h1 className="error-title">{config.title}</h1>
        <p className="error-message">{config.message}</p>

        <div className="error-actions">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Retry
          </button>
          <Link to="/" className="btn btn-outline">Go Home</Link>
        </div>
      </div>
    </div>
  );
}