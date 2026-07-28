const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Add Review
router.post("/add", authMiddleware, reviewController.addReview);

// Get Reviews of a Movie
router.get("/:movieId", reviewController.getReviews);

module.exports = router;