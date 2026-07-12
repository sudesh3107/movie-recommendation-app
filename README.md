# Marquee — Movie Recommendation Website

A full-stack movie recommendation app: **React** frontend + **Node/Express** backend. Browse movies, search, filter by genre, save favorites, and get genre-based "you might also like" recommendations. Built as a beginner-friendly full-stack project — no API keys or database needed, all data is a local JSON file.

## Tech Stack

- **Frontend:** React, React Router, Vite, lucide-react icons
- **Backend:** Node.js, Express, CORS

## Project Structure

```
movie-recommendation-app/
├── backend/
│   ├── data/movies.json      # movie dataset (30 movies)
│   ├── server.js             # Express API
│   └── package.json
├── frontend/
│   └── src/
│       ├── components/       # Navbar, SearchBar, GenreFilter, MovieCard, MovieGrid...
│       ├── pages/            # Home, MovieDetail, Favorites
│       ├── context/          # FavoritesContext (global favorites state)
│       ├── hooks/            # useFavorites
│       ├── utils/            # gradients.js (poster colors)
│       └── api.js            # fetch calls to the backend
└── package.json              # root convenience scripts
```

## Getting Started

**1. Install dependencies**

```bash
npm run install-all
```

**2. Run the app**

```bash
npm run dev
```

This starts the backend on **http://localhost:5000** and the frontend on **http://localhost:5173** together. Open the frontend URL in your browser.

Prefer two terminals instead?

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## API Endpoints

| Method | Endpoint                          | Description                          |
|--------|------------------------------------|---------------------------------------|
| GET    | `/api/movies`                     | List movies (`?search=`, `?genre=`)  |
| GET    | `/api/movies/:id`                 | Get a single movie                   |
| GET    | `/api/movies/:id/recommendations` | Get similar movies (genre-matched)   |
| GET    | `/api/genres`                     | List all genres                      |

**How recommendations work:** each other movie is scored by how many genres it shares with the current one, sorted by that score (rating as tiebreaker), and the top 6 are returned. Simple content-based filtering — see `backend/server.js`.

## Ideas to Extend

- Swap the local dataset for real data from the [TMDB API](https://www.themoviedb.org/documentation/api)
- Add user accounts + a real database (MongoDB/PostgreSQL) instead of localStorage favorites
- Add user ratings/reviews
- Deploy backend (Render/Railway) + frontend (Vercel/Netlify)

Ratings, runtimes, and descriptions in the sample dataset are illustrative — swap in real data anytime.
