const axios = require("axios");

async function getManifest({ movieId, videoId }) {
  if (!movieId) {
    throw new Error("getManifest: movieId is required");
  }
  // videoId optional - many providers only need movieId. Fallback to movieId if not provided.
  const vid = videoId || movieId;

  const baseURL = process.env.VIDEO_MANIFEST_BASE_URL;
  if (!baseURL) {
    throw new Error("VIDEO_MANIFEST_BASE_URL is not configured");
  }
  try {
    new URL(baseURL);
  } catch {
    throw new Error("VIDEO_MANIFEST_BASE_URL is invalid URL");
  }

  try {
    const response = await axios.get(baseURL, {
      params: {
        path: `/embed/movie/${encodeURIComponent(movieId)}`,
        server: process.env.VIDEO_SERVER || "s1",
        vid,
      },
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "User-Agent": "movie-recommender/1.0",
      },
      validateStatus: (s) => s >= 200 && s < 300,
    });

    if (!response.data) throw new Error("Empty manifest response");
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(
        `Manifest failed: ${err.response.status} ${err.response.statusText}`
      );
    }
    if (err.code === "ECONNABORTED") {
      throw new Error("Manifest request timed out");
    }
    throw new Error(`Manifest request failed: ${err.message}`);
  }
}

module.exports = {
  getManifest,
};
