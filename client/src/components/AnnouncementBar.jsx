import { useEffect, useState } from 'react';

const MESSAGES = [
  '🚚 Free shipping on orders over $100',
  '💜 New arrivals every week',
  '🔒 Secure checkout · JWT protected',
  '↩️ 30-day easy returns',
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="announcement-bar">
      <div className="container announcement-inner">
        <span className="announcement-msg" key={idx}>{MESSAGES[idx]}</span>
      </div>
    </div>
  );
}