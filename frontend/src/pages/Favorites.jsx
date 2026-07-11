import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { fetchMovies } from '../api';
import { useFavorites } from '../hooks/useFavorites';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Favorites() {
  const { favoriteIds } = useFavorites();
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies()
      .then((data) => {
        setAllMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const favoriteMovies = allMovies.filter((movie) => favoriteIds.includes(movie.id));

  return (
    <div className="favorites-page">
      <h1>Your Favorites</h1>

      {favoriteMovies.length === 0 ? (
        <div className="empty-state">
          <Heart size={36} strokeWidth={1.5} />
          <p>You haven't saved any favorites yet.</p>
          <Link to="/" className="cta-btn">
            Browse Movies
          </Link>
        </div>
      ) : (
        <MovieGrid movies={favoriteMovies} />
      )}
    </div>
  );
}

export default Favorites;
