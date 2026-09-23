import { Link } from 'react-router-dom';

export default function Logo({ to = '/', size = 'md' }) {
  const sizeMap = { sm: 28, md: 34, lg: 44 };
  const px = sizeMap[size] || sizeMap.md;

  return (
    <Link to={to} className="logo-brand" aria-label="ShahidShop home">
      <span
        className="logo-mark"
        style={{ width: px, height: px, fontSize: px * 0.5 }}
      >
        <svg viewBox="0 0 64 64" width={px} height={px} aria-hidden="true">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="14" fill="url(#logoGrad)" />
          <path
            d="M22 40c0 2.5 2.2 4 5.5 4s5.5-1.4 5.5-3.7c0-2.2-1.6-3.2-5-4-4.5-1-7-2.6-7-6.2C21 26.5 24 24 28.5 24c4 0 7 1.6 7.5 4.6l-3.5 1c-.3-1.6-1.8-2.6-4-2.6-2.2 0-3.6 1-3.6 2.4 0 1.6 1.5 2.3 5 3.2 4.4 1.1 7 2.7 7 6.5 0 4.2-3.4 6.9-8.4 6.9-4.8 0-8-2.2-8.4-5.7L22 40z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="logo-text">
        Shahid<span className="logo-dot">Shop</span>
      </span>
    </Link>
  );
}