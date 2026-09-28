// Stream source: demo fallback when VIDEO_MANIFEST_BASE_URL is not configured or fails.
// Uses a public, CORS-enabled HLS sample (Mux Big Buck Bunny). Replace with your
// provider URL via VIDEO_MANIFEST_BASE_URL env var for real movie streams.
//
// apiplayer.ru was 404 (verified 2026-09-24) -> replaced with working demo.

const DEMO_HLS_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const DEMO_MP4_URL = "https://media.w3.org/2010/05/bunny/trailer.mp4";

const getDemoStream = (movieId) => ({
    url: DEMO_HLS_URL,
    fallbackUrl: DEMO_MP4_URL,
    title: "Demo Sample (Big Buck Bunny)",
});

module.exports = { getDemoStream };
