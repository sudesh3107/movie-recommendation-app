const movieService = require("../services/omdbService");
const Review = require("../models/reviewModel");
const History = require("../models/historyModel");
const { getDemoStream } = require("../config/demoStreams");

// ==============================
// Home Page
// ==============================

const searchMovies = async (req, res) => {

    try {

        const movieName = req.query.search || "";
        let movies = [];

        if (movieName) {
            movies = await movieService.searchMovies(movieName);
        }

        const results = await Promise.allSettled([
            movieService.getTrendingMovies(),
            movieService.getTopRatedMovies(),
            movieService.getNowPlayingMovies(),
            movieService.getIndianMovies()
        ]);

        const trending =
            results[0].status === "fulfilled" ? results[0].value : [];

        const topRated =
            results[1].status === "fulfilled" ? results[1].value : [];

        const nowPlaying =
            results[2].status === "fulfilled" ? results[2].value : [];

        const indianMovies =
            results[3].status === "fulfilled" ? results[3].value : [];

        res.render("index", {
            movies,
            trending,
            topRated,
            nowPlaying,
            indianMovies,
            search: movieName,
            user: res.locals.user || null
        });

    } catch (error) {

        console.log(error);

        res.render("index", {
            movies: [],
            trending: [],
            topRated: [],
            nowPlaying: [],
            indianMovies: [],
            search: req.query.search || "",
            user: res.locals.user || null
        });

    }

};

// ==============================
// Movie Details
// ==============================

const getMovieDetails = async (req, res) => {

    try {

        // Fetch movie details
        const movie = await movieService.getMovieDetails(req.params.id);

        if (!movie) {

            return res.render("error", {
                message: "Movie details could not be loaded.",
                user: res.locals.user || null
            });

        }

        // ==============================
        // Save Watch History
        // ==============================

        if (res.locals.user) {

            try {

                await History.addMovie(
                    res.locals.user.id,
                    movie
                );

            } catch (historyError) {

                console.log("History Error:", historyError);

            }

        }

        // Similar Movies

        const similarMovies = await movieService.getSimilarMovies(req.params.id);

        // Reviews

        Review.getReviews(movie.id, (err, reviews) => {

            if (err) {

                console.log(err);

                reviews = [];

            }

            Review.getAverageRating(movie.id, (err2, avgResult) => {

                if (err2) {

                    console.log(err2);

                }

                const averageRating =
                    avgResult && avgResult.length
                        ? avgResult[0].averageRating
                        : 0;

                const totalReviews =
                    avgResult && avgResult.length
                        ? avgResult[0].totalReviews
                        : 0;

                res.render("movie-details", {

                    movie,

                    similarMovies,

                    reviews,

                    averageRating,

                    totalReviews,

                    user: res.locals.user || null

                });

            });

        });

    } catch (error) {

        console.log(error);

        res.render("error", {

            message: "Something went wrong while loading movie details.",

            user: res.locals.user || null

        });

    }

};

// ==============================
// Watch Movie
// ==============================

const getMovieWatch = async (req, res) => {

    try {

        const movie = await movieService.getMovieDetails(req.params.id);

        if (!movie) {

            return res.render("error", {

                message: "Movie not found.",

                user: res.locals.user || null

            });

        }

        res.render("watch", {

            movie,

            user: res.locals.user || null,

            demoSrc: getDemoStream(req.params.id)

        });

    } catch (error) {

        console.log(error);

        res.render("error", {

            message: "Something went wrong while loading the player.",

            user: res.locals.user || null

        });

    }

};

// ==============================
// Export
// ==============================

module.exports = {

    searchMovies,

    getMovieDetails,

    getMovieWatch

};