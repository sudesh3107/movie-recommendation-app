const db = require("../config/db");
const movieService = require("../services/omdbService");

const Recommendation = {

    // ======================================
    // Get Favorite Genres
    // ======================================

    async getFavoriteGenres(userId) {

        return new Promise((resolve, reject) => {

            const sql = `
                SELECT movie_id
                FROM watch_history
                WHERE user_id = ?
                ORDER BY watched_at DESC
                LIMIT 20
            `;

            db.query(sql, [userId], async (err, rows) => {

                if (err) return reject(err);

                if (rows.length === 0) {

                    return resolve([]);

                }

                try {

                    const genreCount = {};

                    for (const row of rows) {

                        const movie =
                            await movieService.getMovieDetails(row.movie_id);

                        if (movie && movie.genres) {

                            movie.genres.forEach(genre => {

                                genreCount[genre.id] = genreCount[genre.id]
                                    ? {
                                        id: genre.id,
                                        name: genre.name,
                                        count: genreCount[genre.id].count + 1
                                    }
                                    : {
                                        id: genre.id,
                                        name: genre.name,
                                        count: 1
                                    };

                            });

                        }

                    }

                    const favorites = Object.values(genreCount)
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 3);

                    resolve(favorites);

                } catch (error) {

                    reject(error);

                }

            });

        });

    },

    // ======================================
    // Recommended Movies
    // ======================================

    async getRecommendations(userId) {

        const favoriteGenres =
            await this.getFavoriteGenres(userId);

        if (favoriteGenres.length === 0) {

            return [];

        }

        const genreId = favoriteGenres[0].id;

        const movies =
            await movieService.getMoviesByGenre(genreId);

        return movies.slice(0, 12);

    }

};

module.exports = Recommendation;