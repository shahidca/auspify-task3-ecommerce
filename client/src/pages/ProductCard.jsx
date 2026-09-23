import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const outOfStock = product.stock === 0;
  const cover = product.images?.[0];
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {cover && !imgFailed ? (
          <img
            src={cover}
            alt={product.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="product-image-placeholder">
            <span style={{ fontSize: '3rem' }}>📦</span>
            <span style={{ fontSize: '0.7rem', marginTop: 4, opacity: 0.6 }}>
              {product.category}
            </span>
          </div>
        )}

        {outOfStock && <span className="product-badge">Out of Stock</span>}
        {!outOfStock && product.stock < 5 && (
          <span className="product-badge low">Only {product.stock} left</span>
        )}
        {product.ratingAverage > 0 && (
          <span
            className="product-badge"
            style={{ left: 'auto', right: 10, background: 'rgba(0,0,0,0.75)' }}
          >
            ⭐ {product.ratingAverage} ({product.reviewCount})
          </span>
        )}
      </div>

      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}