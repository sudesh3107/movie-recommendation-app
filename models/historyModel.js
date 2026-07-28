const db = require("../config/db");

const History = {

    // Add movie to history (avoid duplicates)
    addMovie(userId, movie) {

        return new Promise((resolve, reject) => {

            const checkSql = `
                SELECT id
                FROM watch_history
                WHERE user_id = ? AND movie_id = ?
            `;

            db.query(checkSql, [userId, movie.id], (err, rows) => {

                if (err) return reject(err);

                // Movie already exists in history
                if (rows.length > 0) {

                    const updateSql = `
                        UPDATE watch_history
                        SET watched_at = CURRENT_TIMESTAMP
                        WHERE user_id = ? AND movie_id = ?
                    `;

                    db.query(updateSql, [userId, movie.id], (err2, result) => {

                        if (err2) return reject(err2);

                        resolve(result);

                    });

                } else {

                    // Insert new history record
                    const insertSql = `
                        INSERT INTO watch_history
                        (user_id, movie_id, title, poster)
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        insertSql,
                        [
                            userId,
                            movie.id,
                            movie.title,
                            movie.poster_path
                        ],
                        (err3, result) => {

                            if (err3) return reject(err3);

                            resolve(result);

                        }
                    );

                }

            });

        });

    },

    // Get recently watched movies
    getHistory(userId) {

        return new Promise((resolve, reject) => {

            const sql = `
                SELECT *
                FROM watch_history
                WHERE user_id = ?
                ORDER BY watched_at DESC
                LIMIT 20
            `;

            db.query(sql, [userId], (err, result) => {

                if (err) return reject(err);

                resolve(result);

            });

        });

    }

};

module.exports = History;