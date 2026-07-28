const express = require("express");
const router = express.Router();

const watchlistController = require("../controllers/watchlistController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, watchlistController.addMovie);

router.get("/", authMiddleware, watchlistController.getWatchlist);

router.get("/remove/:id", authMiddleware, watchlistController.removeMovie);

module.exports = router;