const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const rateLimit = require("../middleware/rateLimit");

// Register
router.post("/register", rateLimit, authController.register);

// Login
router.post("/login", rateLimit, authController.login);

// Logout
router.get("/logout", authController.logout);

module.exports = router;