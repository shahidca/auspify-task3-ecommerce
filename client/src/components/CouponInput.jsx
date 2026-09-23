import { useState } from 'react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';

export default function CouponInput({ subtotal, applied, onApply }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/coupons/validate', { code: code.trim(), subtotal });
      onApply(res.data.coupon);
      toast.success(`Coupon applied — saved $${res.data.coupon.discount.toFixed(2)}`);
      setCode('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <div className="coupon-applied">
        <div>
          <div style={{ fontWeight: 700, color: 'var(--success)' }}>
            🎟️ {applied.code}
          </div>
          <div className="muted" style={{ fontSize: '0.78rem' }}>
            {applied.description} · −${applied.discount.toFixed(2)}
          </div>
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onApply(null)}
          type="button"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="coupon-input">
      <input
        type="text"
        placeholder="Coupon code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApply())}
        disabled={loading}
      />
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={handleApply}
        disabled={loading || !code.trim()}
      >
        {loading ? '...' : 'Apply'}
      </button>
    </div>
  );
}