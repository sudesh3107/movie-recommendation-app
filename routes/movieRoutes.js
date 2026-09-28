const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movieController");

// Home Page - Search Movies
router.get("/", movieController.searchMovies);

// Movie Trailer (embeddable URL for in-page popup)
router.get("/movie/:id/trailer", movieController.getMovieTrailer);

// Movie Details Page
router.get("/movie/:id", movieController.getMovieDetails);

// Watch Movie Page
router.get("/movie/:id/watch", movieController.getMovieWatch);

module.exports = router;