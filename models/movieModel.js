const db = require("../config/db");

const getAllMovies = (callback) => {
    const sql = "SELECT * FROM movies";

    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, results);
    });
};

module.exports = {
    getAllMovies
};