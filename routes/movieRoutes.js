const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movieController");

// Home Page - Search Movies
router.get("/", movieController.searchMovies);

// Movie Details Page
router.get("/movie/:id", movieController.getMovieDetails);

module.exports = router;