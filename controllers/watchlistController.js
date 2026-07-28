const Watchlist = require("../models/watchlistModel");

// ==============================
// Add Movie
// ==============================

const addMovie = (req, res) => {

    const userId = req.user.id;

    const { movie_id, movie_title, poster } = req.body;

    // Check if movie already exists
    Watchlist.getWatchlist(userId, (err, movies) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database Error");
        }

        const exists = movies.find(
            movie => movie.movie_id == movie_id
        );

        if (exists) {
            return res.redirect("/watchlist");
        }

        Watchlist.addToWatchlist(
            userId,
            movie_id,
            movie_title,
            poster,
            (err) => {

                if (err) {
                    console.error(err);
                    return res.status(500).send("Failed to add movie.");
                }

                res.redirect("/watchlist");

            }
        );

    });

};

// ==============================
// Get Watchlist
// ==============================

const getWatchlist = (req, res) => {

    Watchlist.getWatchlist(req.user.id, (err, movies) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database Error");
        }

        // Sort latest first
        movies.reverse();

        res.render("watchlist", {
            movies,
            user: req.user
        });

    });

};

// ==============================
// Remove Movie
// ==============================

const removeMovie = (req, res) => {

    Watchlist.removeMovie(
        req.params.id,
        req.user.id,
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Delete Failed");
            }

            res.redirect("/watchlist");

        }
    );

};

module.exports = {
    addMovie,
    getWatchlist,
    removeMovie
};