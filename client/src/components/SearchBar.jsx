import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (q.trim().length < 2) {
        setResults([]);
        return;
      }
      try {
        const res = await api.get('/products', { params: { search: q, limit: 5 } });
        setResults(res.data.data.slice(0, 5));
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const goToProduct = (id) => {
    setOpen(false);
    setQ('');
    navigate(`/products/${id}`);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    navigate(`/products?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="searchbar" ref={boxRef}>
      <form onSubmit={submit}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </form>

      {open && q.trim().length >= 2 && (
        <div className="searchbar-dropdown">
          {results.length === 0 ? (
            <div className="searchbar-empty">No matches for "{q}"</div>
          ) : (
            <>
              {results.map((p) => (
                <button
                  key={p.id}
                  className="searchbar-item"
                  onClick={() => goToProduct(p.id)}
                >
                  <div className="searchbar-thumb">
                    {p.images?.[0] ? <img src={p.images[0]} alt="" /> : '📦'}
                  </div>
                  <div className="searchbar-info">
                    <div className="searchbar-name">{p.name}</div>
                    <div className="searchbar-meta">
                      <span>{p.category}</span>
                      <span className="searchbar-price">${p.price.toFixed(2)}</span>
                    </div>
                  </div>
                </button>
              ))}
              <button className="searchbar-all" onClick={submit}>
                See all results for "{q}" →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}