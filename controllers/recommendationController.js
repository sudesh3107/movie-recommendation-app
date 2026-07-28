const Recommendation = require("../models/recommendationModel");

// =====================================
// Show Recommended Movies
// =====================================

const showRecommendations = async (req, res) => {

    try {

        const user = req.user;

        const favoriteGenres =
            await Recommendation.getFavoriteGenres(user.id);

        const recommendations =
            await Recommendation.getRecommendations(user.id);

        res.render("recommendations", {

            user,

            favoriteGenres,

            recommendations

        });

    } catch (err) {

        console.log(err);

        res.render("recommendations", {

            user: req.user,

            favoriteGenres: [],

            recommendations: []

        });

    }

};

module.exports = {

    showRecommendations

};