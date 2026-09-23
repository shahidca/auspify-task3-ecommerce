import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page container text-center">
      <h1 style={{ fontSize: '4rem', marginBottom: 8 }}>404</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Page not found.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}