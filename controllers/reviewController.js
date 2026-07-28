const Review = require("../models/reviewModel");

// ==========================
// Add Review
// ==========================

const addReview = (req, res) => {

    const userId = req.user.id;

    const {
        movie_id,
        movie_title,
        rating,
        review
    } = req.body;

    Review.addReview(
        userId,
        movie_id,
        movie_title,
        rating,
        review,
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Unable to add review.");
            }

            res.redirect("/movie/" + movie_id);

        }
    );

};

// ==========================
// Get Reviews
// ==========================

const getReviews = (req, res) => {

    Review.getReviews(req.params.movieId, (err, reviews) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database Error");
        }

        res.json(reviews);

    });

};

module.exports = {
    addReview,
    getReviews
};