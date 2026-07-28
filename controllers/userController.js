const User = require("../models/userModel");
const Watchlist = require("../models/watchlistModel");

exports.getProfile = (req, res) => {

    User.findById(req.user.id, (err, result) => {

        if (err || result.length === 0) {
            return res.redirect("/login");
        }

        const user = result[0];

        Watchlist.getWatchlist(req.user.id, (err, movies) => {

            if (err) {
                movies = [];
            }

            res.render("profile", {
                user,
                watchlistCount: movies.length
            });

        });

    });

};