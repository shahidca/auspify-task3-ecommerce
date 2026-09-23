const STEPS = [
  { key: 'pending', label: 'Pending', icon: '🕐' },
  { key: 'paid', label: 'Paid', icon: '💳' },
  { key: 'shipped', label: 'Shipped', icon: '📦' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
];

export default function OrderTimeline({ status, createdAt, updatedAt }) {
  if (status === 'cancelled') {
    return (
      <div className="order-timeline cancelled">
        <div className="timeline-cancel">
          <span style={{ fontSize: '2rem' }}>❌</span>
          <div>
            <div style={{ fontWeight: 700 }}>Order Cancelled</div>
            <div className="muted" style={{ fontSize: '0.85rem' }}>
              {new Date(updatedAt || createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="order-timeline">
      {STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;

        return (
          <div key={step.key} className={`timeline-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="timeline-dot">
              <span>{done ? '✓' : i + 1}</span>
            </div>
            <div className="timeline-body">
              <div className="timeline-label">{step.label}</div>
              {active && (
                <div className="muted" style={{ fontSize: '0.78rem' }}>
                  {new Date(updatedAt || createdAt).toLocaleString()}
                </div>
              )}
            </div>
            {i < STEPS.length - 1 && <div className={`timeline-connector ${done ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}