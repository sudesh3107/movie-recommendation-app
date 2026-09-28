const movieService = require("../services/omdbService");
const Review = require("../models/reviewModel");
const History = require("../models/historyModel");
const { getDemoStream } = require("../config/demoStreams");
let VideoProvider;
try {
  VideoProvider = require("../services/VideoProvider");
} catch (_) {
  VideoProvider = null;
}

function extractStreamUrl(manifest) {
  if (!manifest) return null;
  if (typeof manifest === "string" && manifest.startsWith("http")) return manifest;
  // common shapes: {url}, {source}, {file}, {m3u8}, {data:{url}}, {sources:[{file}]}
  if (manifest.url && typeof manifest.url === "string") return manifest.url;
  if (manifest.source && typeof manifest.source === "string") return manifest.source;
  if (manifest.file && typeof manifest.file === "string") return manifest.file;
  if (manifest.m3u8 && typeof manifest.m3u8 === "string") return manifest.m3u8;
  if (manifest.src && typeof manifest.src === "string") return manifest.src;
  if (manifest.data && typeof manifest.data.url === "string") return manifest.data.url;
  if (manifest.data && typeof manifest.data.source === "string") return manifest.data.source;
  if (Array.isArray(manifest.sources) && manifest.sources[0]?.file) return manifest.sources[0].file;
  if (Array.isArray(manifest.sources) && manifest.sources[0]?.url) return manifest.sources[0].url;
  if (Array.isArray(manifest) && manifest[0]?.file) return manifest[0].file;
  return null;
}

// ==============================
// Home Page
// ==============================

const searchMovies = async (req, res) => {

    try {

        const movieName = req.query.search || "";
        let movies = [];

        if (movieName) {
            movies = await movieService.searchMovies(movieName);
        }

        const results = await Promise.allSettled([
            movieService.getTrendingMovies(),
            movieService.getTopRatedMovies(),
            movieService.getNowPlayingMovies(),
            movieService.getIndianMovies()
        ]);

        const trending =
            results[0].status === "fulfilled" ? results[0].value : [];

        const topRated =
            results[1].status === "fulfilled" ? results[1].value : [];

        const nowPlaying =
            results[2].status === "fulfilled" ? results[2].value : [];

        const indianMovies =
            results[3].status === "fulfilled" ? results[3].value : [];

        res.render("index", {
            movies,
            trending,
            topRated,
            nowPlaying,
            indianMovies,
            search: movieName,
            user: res.locals.user || null
        });

    } catch (error) {

        console.log(error);

        res.render("index", {
            movies: [],
            trending: [],
            topRated: [],
            nowPlaying: [],
            indianMovies: [],
            search: req.query.search || "",
            user: res.locals.user || null
        });

    }

};

// ==============================
// Movie Details
// ==============================

const getMovieDetails = async (req, res) => {

    try {

        // Fetch movie details
        const movie = await movieService.getMovieDetails(req.params.id);

        if (!movie) {

            return res.render("error", {
                message: "Movie details could not be loaded.",
                user: res.locals.user || null
            });

        }

        // ==============================
        // Save Watch History
        // ==============================

        if (res.locals.user) {

            try {

                await History.addMovie(
                    res.locals.user.id,
                    movie
                );

            } catch (historyError) {

                console.log("History Error:", historyError);

            }

        }

        // Similar Movies

        const similarMovies = await movieService.getSimilarMovies(req.params.id);

        // Reviews

        Review.getReviews(movie.id, (err, reviews) => {

            if (err) {

                console.log(err);

                reviews = [];

            }

            Review.getAverageRating(movie.id, (err2, avgResult) => {

                if (err2) {

                    console.log(err2);

                }

                const averageRating =
                    avgResult && avgResult.length
                        ? avgResult[0].averageRating
                        : 0;

                const totalReviews =
                    avgResult && avgResult.length
                        ? avgResult[0].totalReviews
                        : 0;

                res.render("movie-details", {

                    movie,

                    similarMovies,

                    reviews,

                    averageRating,

                    totalReviews,

                    user: res.locals.user || null

                });

            });

        });

    } catch (error) {

        console.log(error);

        res.render("error", {

            message: "Something went wrong while loading movie details.",

            user: res.locals.user || null

        });

    }

};

// ==============================
// Movie Trailer
// ==============================

const getMovieTrailer = async (req, res) => {

    try {

        const trailerUrl = await movieService.getMovieTrailer(req.params.id);

        if (!trailerUrl) {

            return res.status(404).json({
                error: "Trailer not available for this movie."
            });

        }

        const parsedUrl = new URL(trailerUrl);
        const videoKey = parsedUrl.searchParams.get("v");

        if (!videoKey || !/^[A-Za-z0-9_-]+$/.test(videoKey)) {

            return res.status(404).json({
                error: "Trailer not available for this movie."
            });

        }

        return res.json({
            embedUrl: `https://www.youtube-nocookie.com/embed/${videoKey}`
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: "Could not load the trailer."
        });

    }

};

// ==============================
// Watch Movie
// ==============================

const getMovieWatch = async (req, res) => {

    try {

        const movie = await movieService.getMovieDetails(req.params.id);

        if (!movie) {

            return res.render("error", {

                message: "Movie not found.",

                user: res.locals.user || null

            });

        }

        // Start with working demo fallback (mux sample)
        let demoSrc = getDemoStream(req.params.id);
        let manifestError = null;

        // If VIDEO_MANIFEST_BASE_URL is configured, try real provider
        if (process.env.VIDEO_MANIFEST_BASE_URL && VideoProvider) {
            try {
                const manifest = await VideoProvider.getManifest({
                    movieId: req.params.id,
                    videoId: req.query.vid || req.query.videoId || req.params.id,
                });
                const streamUrl = extractStreamUrl(manifest);
                if (streamUrl && streamUrl.startsWith("http")) {
                    demoSrc = {
                        url: streamUrl,
                        fallbackUrl: null,
                        title: manifest.title || manifest.name || `Stream for ${movie.title}`,
                    };
                    console.log(`[watch] using provider stream for ${req.params.id}: ${streamUrl.slice(0,60)}...`);
                } else {
                    console.log(`[watch] provider returned no usable URL for ${req.params.id}, using demo. manifest:`, JSON.stringify(manifest).slice(0,300));
                    manifestError = "Provider returned no playable URL";
                }
            } catch (e) {
                manifestError = e.message;
                console.log(`[watch] VideoProvider failed for ${req.params.id}: ${e.message} -> falling back to demo`);
            }
        } else if (!process.env.VIDEO_MANIFEST_BASE_URL) {
            console.log(`[watch] VIDEO_MANIFEST_BASE_URL not set, using demo stream for ${req.params.id}`);
        }

        res.render("watch", {

            movie,

            user: res.locals.user || null,

            demoSrc,
            manifestError,

        });

    } catch (error) {

        console.log(error);

        res.render("error", {

            message: "Something went wrong while loading the player.",

            user: res.locals.user || null

        });

    }

};

// ==============================
// Export
// ==============================

module.exports = {

    searchMovies,

    getMovieDetails,

    getMovieTrailer,

    getMovieWatch

};