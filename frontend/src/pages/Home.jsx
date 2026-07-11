import { useState, useEffect } from 'react';
import { fetchMovies, fetchGenres } from '../api';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the genre list once, for the filter pills.
  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch(() => {
        /* the main fetch below will surface the error message */
      });
  }, []);

  // Re-fetch movies whenever the search term or genre changes. The search
  // input is debounced by 300ms so we're not hitting the API on every
  // single keystroke.
  useEffect(() => {
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      fetchMovies({ search, genre })
        .then((data) => {
          setMovies(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, genre]);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Find your next favorite movie</h1>
        <p>Search the catalog, filter by genre, and get picks matched to what you love.</p>
        <SearchBar value={search} onChange={setSearch} />
      </section>

      {genres.length > 0 && (
        <GenreFilter genres={genres} selected={genre} onSelect={setGenre} />
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <MovieGrid movies={movies} />}
    </div>
  );
}

export default Home;
