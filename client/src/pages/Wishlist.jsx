import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="page container">
      <h1 className="page-title">My Wishlist ({items.length})</h1>

      {items.length === 0 ? (
        <div className="empty">
          <p style={{ fontSize: '3rem', marginBottom: 12 }}>💜</p>
          <p style={{ marginBottom: 20 }}>Your wishlist is empty.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="products-grid">
          {items.map((w) => (
            <ProductCard key={w.id} product={w.product} />
          ))}
        </div>
      )}
    </div>
  );
}