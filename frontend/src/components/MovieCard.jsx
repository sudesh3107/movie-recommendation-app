import { Link } from 'react-router-dom';
import { Heart, Star, Film } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { getPosterGradient } from '../utils/gradients';

function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  // Stop the click from also triggering the card's <Link> navigation.
  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie.id);
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster" style={{ background: getPosterGradient(movie) }}>
        <Film className="poster-icon" size={34} strokeWidth={1.5} />
        <button
          className={`favorite-btn ${favorite ? 'is-favorite' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{movie.year}</span>
          <span className="rating">
            <Star size={12} fill="currentColor" />
            {movie.rating}
          </span>
        </div>
        <div className="genre-tags">
          {movie.genres.slice(0, 2).map((g) => (
            <span key={g} className="genre-tag">
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
