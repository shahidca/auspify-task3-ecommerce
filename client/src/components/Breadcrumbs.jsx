import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        return (
          <span key={idx} className="breadcrumb-item">
            {last ? (
              <span className="breadcrumb-current">{item.label}</span>
            ) : (
              <Link to={item.to} className="breadcrumb-link">{item.label}</Link>
            )}
            {!last && <span className="breadcrumb-sep">/</span>}
          </span>
        );
      })}
    </nav>
  );
}