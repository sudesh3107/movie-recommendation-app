const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Friendly root route so visiting http://localhost:5000 isn't a dead end
app.get('/', (req, res) => {
  res.send('Movie Recommendation API is running. Try /api/movies');
});

// GET /api/movies?search=&genre=
// Returns every movie, optionally filtered by a title/director search term
// and/or an exact genre match.
app.get('/api/movies', (req, res) => {
  const { search, genre } = req.query;
  let results = movies;

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(
      (movie) =>
        movie.title.toLowerCase().includes(term) ||
        movie.director.toLowerCase().includes(term)
    );
  }

  if (genre && genre !== 'All') {
    results = results.filter((movie) => movie.genres.includes(genre));
  }

  res.json(results);
});

// GET /api/genres
// Returns every unique genre used across the catalog, alphabetised.
// The frontend uses this to build the filter pills.
app.get('/api/genres', (req, res) => {
  const genreSet = new Set();
  movies.forEach((movie) => movie.genres.forEach((g) => genreSet.add(g)));
  res.json([...genreSet].sort());
});

// GET /api/movies/:id
// Returns a single movie by id, or a 404 if it doesn't exist.
app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find((m) => m.id === Number(req.params.id));
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
});

// GET /api/movies/:id/recommendations
// Simple content-based filtering: score every other movie by how many
// genres it shares with the target movie, then return the top 6 -
// using rating as a tiebreaker when scores are equal.
app.get('/api/movies/:id/recommendations', (req, res) => {
  const target = movies.find((m) => m.id === Number(req.params.id));
  if (!target) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const recommendations = movies
    .filter((m) => m.id !== target.id)
    .map((m) => {
      const sharedGenres = m.genres.filter((g) => target.genres.includes(g)).length;
      return { ...m, matchScore: sharedGenres };
    })
    .filter((m) => m.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore || b.rating - a.rating)
    .slice(0, 6);

  res.json(recommendations);
});

app.listen(PORT, () => {
  console.log(`Movie API server running at http://localhost:${PORT}`);
});
