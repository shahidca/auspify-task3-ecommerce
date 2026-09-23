import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageLoader() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Start progress
    setVisible(true);
    setProgress(15);

    const t1 = setTimeout(() => setProgress(45), 120);
    const t2 = setTimeout(() => setProgress(75), 300);

    // Finish shortly after route change
    const t3 = setTimeout(() => {
      setProgress(100);
      const t4 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(t4);
    }, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="page-loader-bar" aria-hidden="true">
      <div
        className="page-loader-fill"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100
            ? 'width 0.2s ease, opacity 0.3s ease 0.1s'
            : 'width 0.4s ease',
        }}
      />
    </div>
  );
}