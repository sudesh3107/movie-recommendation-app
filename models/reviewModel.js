const db = require("../config/db");

// ==============================
// Add Review
// ==============================

const addReview = (userId, movieId, movieTitle, rating, review, callback) => {

    const sql = `
        INSERT INTO reviews
        (user_id, movie_id, movie_title, rating, review)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [userId, movieId, movieTitle, rating, review],
        callback
    );

};

// ==============================
// Get Reviews with User Name
// ==============================

const getReviews = (movieId, callback) => {

    const sql = `
        SELECT
            reviews.*,
            users.fullname
        FROM reviews
        INNER JOIN users
            ON reviews.user_id = users.id
        WHERE reviews.movie_id = ?
        ORDER BY reviews.created_at DESC
    `;

    db.query(sql, [movieId], callback);

};

// ==============================
// Get Average Rating
// ==============================

const getAverageRating = (movieId, callback) => {

    const sql = `
        SELECT
            ROUND(AVG(rating),1) AS averageRating,
            COUNT(*) AS totalReviews
        FROM reviews
        WHERE movie_id = ?
    `;

    db.query(sql, [movieId], callback);

};

module.exports = {
    addReview,
    getReviews,
    getAverageRating
};