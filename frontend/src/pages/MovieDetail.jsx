import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Heart, Film } from 'lucide-react';
import { fetchMovieById, fetchRecommendations } from '../api';
import { useFavorites } from '../hooks/useFavorites';
import { getPosterGradient } from '../utils/gradients';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMovie(null);

    Promise.all([fetchMovieById(id), fetchRecommendations(id)])
      .then(([movieData, recsData]) => {
        setMovie(movieData);
        setRecommendations(recsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return null;

  const favorite = isFavorite(movie.id);

  return (
    <div className="movie-detail">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back to movies
      </Link>

      <div className="detail-banner" style={{ background: getPosterGradient(movie) }}>
        <Film size={56} strokeWidth={1} />
      </div>

      <div className="detail-content">
        <div className="detail-header">
          <h1>{movie.title}</h1>
          <button
            className={`favorite-btn-large ${favorite ? 'is-favorite' : ''}`}
            onClick={() => toggleFavorite(movie.id)}
          >
            <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
            {favorite ? 'Saved' : 'Add to Favorites'}
          </button>
        </div>

        <div className="detail-meta">
          <span>{movie.year}</span>
          <span className="meta-with-icon">
            <Clock size={14} />
            {movie.runtime} min
          </span>
          <span className="rating">
            <Star size={14} fill="currentColor" />
            {movie.rating}
          </span>
          <span>Directed by {movie.director}</span>
        </div>

        <div className="genre-tags">
          {movie.genres.map((g) => (
            <span key={g} className="genre-tag">
              {g}
            </span>
          ))}
        </div>

        <p className="description">{movie.description}</p>

        {recommendations.length > 0 && (
          <section className="recommendations">
            <h2>You might also like</h2>
            <MovieGrid movies={recommendations} />
          </section>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
