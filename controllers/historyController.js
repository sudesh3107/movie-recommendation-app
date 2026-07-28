const History = require("../models/historyModel");

// =====================================
// Show Watch History
// =====================================

const showHistory = async (req, res) => {

    try {

        const movies = await History.getHistory(req.user.id);

        res.render("history", {

            user: req.user,

            movies

        });

    } catch (err) {

        console.log(err);

        res.redirect("/");

    }

};

module.exports = {

    showHistory

};