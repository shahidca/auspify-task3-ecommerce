import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');

    if (!token) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    localStorage.setItem('token', token);
    // Full reload so AuthContext picks up the new token
    window.location.replace('/');
  }, [params, navigate]);

  return (
    <div className="page container" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px', width: 24, height: 24, borderWidth: 3, borderTopColor: 'var(--accent)', borderColor: 'var(--border)' }} />
        <p className="muted">Signing you in...</p>
      </div>
    </div>
  );
}