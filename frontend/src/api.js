// Base URL of the backend API. The backend runs separately (see /backend),
// on port 5000 by default - change this if you run it somewhere else.
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch movies, optionally narrowed by a search term and/or genre.
export async function fetchMovies({ search = '', genre = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (genre && genre !== 'All') params.append('genre', genre);

  const res = await fetch(`${API_BASE_URL}/movies?${params.toString()}`);
  if (!res.ok) throw new Error('Could not load movies from the server.');
  return res.json();
}

// Fetch a single movie by id.
export async function fetchMovieById(id) {
  const res = await fetch(`${API_BASE_URL}/movies/${id}`);
  if (!res.ok) throw new Error('That movie could not be found.');
  return res.json();
}

// Fetch genre-based recommendations for a movie.
export async function fetchRecommendations(id) {
  const res = await fetch(`${API_BASE_URL}/movies/${id}/recommendations`);
  if (!res.ok) throw new Error('Could not load recommendations.');
  return res.json();
}

// Fetch the full list of genres, used to build the filter pills.
export async function fetchGenres() {
  const res = await fetch(`${API_BASE_URL}/genres`);
  if (!res.ok) throw new Error('Could not load genres.');
  return res.json();
}
