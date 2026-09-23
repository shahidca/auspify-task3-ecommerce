import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Logo />

        <div className="nav-search-wrap">
          <SearchBar />
        </div>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
          {user && <li><NavLink to="/orders">Orders</NavLink></li>}
          {user?.role === 'admin' && <li><NavLink to="/admin">Admin</NavLink></li>}
          {user && (
            <li>
              <NavLink to="/wishlist">
                Wishlist{wishCount > 0 && <span className="cart-badge">{wishCount}</span>}
              </NavLink>
            </li>
          )}
          {user && (
            <li>
              <NavLink to="/cart">
                Cart{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-user">
          <ThemeToggle />

          {user ? (
            <>
              <Link to="/profile" className="nav-profile-btn" title="My Profile">
                <span className="nav-avatar">{user.name?.[0]?.toUpperCase() || '?'}</span>
                <span className="nav-greeting hide-mobile">{user.name.split(' ')[0]}</span>
              </Link>
              <button className="btn btn-outline btn-sm hide-mobile" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm hide-mobile">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}