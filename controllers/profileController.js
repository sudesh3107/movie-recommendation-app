const User = require("../models/userModel");
const Watchlist = require("../models/watchlistModel");
const History = require("../models/historyModel");
const bcrypt = require("bcrypt");

// =======================================
// Show Profile
// =======================================

const showProfile = async (req, res) => {

    try {

        const user = req.user;

        const watchlist = await Watchlist.getWatchlist(user.id);

        const history = await History.getHistory(user.id);

        res.render("profile", {

            user,

            watchlistCount: watchlist.length,

            recentlyViewed: history

        });

    } catch (err) {

        console.log(err);

        res.redirect("/");

    }

};

// =======================================
// Edit Profile Page
// =======================================

const showEditProfile = (req, res) => {

    res.render("edit-profile", {

        user: req.user

    });

};

// =======================================
// Update Profile
// =======================================

const updateProfile = async (req, res) => {

    try {

        const {

            fullname,

            email,

            password

        } = req.body;

        // Update name and email

        User.updateProfile(

            req.user.id,

            fullname,

            email,

            async (err) => {

                if (err) {

                    console.log(err);

                    return res.redirect("/profile/edit");

                }

                // Update password only if entered

                if (password && password.trim() !== "") {

                    const hashedPassword = await bcrypt.hash(password, 10);

                    User.updatePassword(

                        req.user.id,

                        hashedPassword,

                        (err2) => {

                            if (err2) {

                                console.log(err2);

                            }

                            return res.redirect("/profile");

                        }

                    );

                } else {

                    return res.redirect("/profile");

                }

            }

        );

    } catch (err) {

        console.log(err);

        res.redirect("/profile");

    }

};

// =======================================
// Export
// =======================================

module.exports = {

    showProfile,

    showEditProfile,

    updateProfile

};