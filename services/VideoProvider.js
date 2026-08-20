const axios = require("axios");

async function getManifest({ movieId, videoId }) {
  const response = await axios.get(
    process.env.VIDEO_MANIFEST_BASE_URL,
    {
      params: {
        path: `/embed/movie/${movieId}`,
        server: process.env.VIDEO_SERVER || "s1",
        vid: videoId,
      },
      timeout: 10000,
    }
  );

  return response.data;
}

module.exports = {
  getManifest,
};
