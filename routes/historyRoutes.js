const express = require("express");
const router = express.Router();

const historyController = require("../controllers/historyController");
const authMiddleware = require("../middleware/authMiddleware");

// ======================================
// Watch History Page
// ======================================

router.get(
    "/",
    authMiddleware,
    historyController.showHistory
);

module.exports = router;