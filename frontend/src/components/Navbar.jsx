import { Link, useLocation } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

function Navbar() {
  const { favoriteIds } = useFavorites();
  const { pathname } = useLocation();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <Film size={22} strokeWidth={2} />
        <span>Marquee</span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        <Link to="/favorites" className={pathname === '/favorites' ? 'active' : ''}>
          <Heart size={16} />
          Favorites
          {favoriteIds.length > 0 && <span className="badge">{favoriteIds.length}</span>}
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
