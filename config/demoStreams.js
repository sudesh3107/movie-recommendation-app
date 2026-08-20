// Stream source: points the player at your streaming service.
// Your service must return a playable video (MP4/WebM) at the URL below,
// or the player will show nothing.

const getDemoStream = (movieId) => ({
    url: `https://apiplayer.ru/stream/movie/${movieId}.m3u8`,
    title: "Stream"
});

module.exports = { getDemoStream };
