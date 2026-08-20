// Simple in-memory rate limiter (per-IP sliding window)
// No external dependencies. Replace with redis-backed limiter for multi-instance deploys.

const windowMs = 60 * 1000;
const maxRequests = 20;

const hits = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [key, list] of hits) {
        const alive = list.filter((t) => now - t < windowMs);
        if (alive.length === 0) {
            hits.delete(key);
        } else {
            hits.set(key, alive);
        }
    }
}, windowMs).unref();

const rateLimit = (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!hits.has(key)) {
        hits.set(key, []);
    }

    const list = hits.get(key).filter((t) => now - t < windowMs);

    if (list.length >= maxRequests) {
        return res.status(429).json({
            success: false,
            message: "Too many requests, please try again later."
        });
    }

    list.push(now);
    hits.set(key, list);
    next();
};

module.exports = rateLimit;