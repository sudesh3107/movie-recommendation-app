const db = require("../config/db");

// Add movie
const addToWatchlist = (userId, movieId, movieTitle, poster, callback) => {

    const sql = `
        INSERT INTO watchlist
        (user_id, movie_id, movie_title, poster)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [userId, movieId, movieTitle, poster], callback);

};

// Get only logged-in user's watchlist
const getWatchlist = (userId, callback) => {

    const sql = `
        SELECT *
        FROM watchlist
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [userId], callback);

};

// Remove movie
const removeMovie = (id, userId, callback) => {

    const sql = `
        DELETE FROM watchlist
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(sql, [id, userId], callback);

};

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeMovie
};