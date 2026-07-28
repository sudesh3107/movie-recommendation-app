const axios = require("axios");

const BASE_URL = "https://api.themoviedb.org/3";

// Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000
});

// Always get latest API Key
function getApiKey() {
    return process.env.TMDB_API_KEY;
}

// Reusable request with retry
async function fetchData(url, params = {}) {

    for (let attempt = 1; attempt <= 3; attempt++) {

        try {

            const response = await api.get(url, {
                params: {
                    api_key: getApiKey(),
                    ...params
                }
            });

            return response.data;

        } catch (err) {

            console.log(`Attempt ${attempt} failed: ${url}`);

            if (attempt === 3) {
                console.log(err.response?.status || err.message);
                return null;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// ================= SEARCH =================

const searchMovies = async (movieName) => {

    const data = await fetchData("/search/movie", {
        query: movieName,
        language: "en-US",
        include_adult: false
    });

    if (!data) return [];

    return data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
    }));

};

// ================= MOVIE DETAILS =================

const getMovieDetails = async (id) => {

    const data = await fetchData(`/movie/${id}`);

    return data || null;

};

// ================= TRAILER =================

const getMovieTrailer = async (id) => {

    const data = await fetchData(`/movie/${id}/videos`);

    if (!data) return null;

    const trailer = data.results.find(video =>
        video.site === "YouTube" &&
        video.type === "Trailer"
    );

    return trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : null;

};

// ================= SIMILAR MOVIES =================

const getSimilarMovies = async (id) => {

    const data = await fetchData(`/movie/${id}/similar`);

    return data ? data.results : [];

};

// ================= TRENDING =================

const getTrendingMovies = async () => {

    const data = await fetchData("/trending/movie/week");

    return data ? data.results : [];

};

// ================= TOP RATED =================

const getTopRatedMovies = async () => {

    const data = await fetchData("/movie/top_rated");

    return data ? data.results : [];

};

// ================= NOW PLAYING =================

const getNowPlayingMovies = async () => {

    const data = await fetchData("/movie/now_playing");

    return data ? data.results : [];

};

// ================= INDIAN MOVIES =================

const getIndianMovies = async () => {

    const data = await fetchData("/discover/movie", {
        with_origin_country: "IN",
        sort_by: "popularity.desc"
    });

    return data ? data.results : [];

};

// ================= MOVIES BY GENRE =================

const getMoviesByGenre = async (genreId) => {

    try {

        const response = await axios.get(`${BASE_URL}/discover/movie`, {

            params: {

                api_key: getApiKey(),

                with_genres: genreId,

                sort_by: "popularity.desc",

                language: "en-US",

                page: 1

            }

        });

        return response.data.results;

    } catch (error) {

        console.log("Genre Movies Error:", error.response?.status || error.message);

        return [];

    }

};

module.exports = {

    searchMovies,

    getMovieDetails,

    getMovieTrailer,

    getSimilarMovies,

    getTrendingMovies,

    getTopRatedMovies,

    getNowPlayingMovies,

    getIndianMovies,

    getMoviesByGenre

};