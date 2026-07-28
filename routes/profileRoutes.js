const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

// ==============================
// Profile Page
// ==============================

router.get(
    "/",
    authMiddleware,
    profileController.showProfile
);

// ==============================
// Edit Profile Page
// ==============================

router.get(
    "/edit",
    authMiddleware,
    profileController.showEditProfile
);

// ==============================
// Update Profile
// ==============================

router.post(
    "/edit",
    authMiddleware,
    profileController.updateProfile
);

module.exports = router;