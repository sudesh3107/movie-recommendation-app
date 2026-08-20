const jwt = require("jsonwebtoken");

// Requires authMiddleware to run first (sets req.user)
const requireAdmin = (req, res, next) => {
    const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

    if (adminEmails.length === 0) {
        return res.status(403).send("Admin access is not configured (ADMIN_EMAILS is empty).");
    }

    if (!req.user || !adminEmails.includes(String(req.user.email).toLowerCase())) {
        return res.status(403).send("Access denied.");
    }

    next();
};

module.exports = requireAdmin;