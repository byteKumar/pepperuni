const express = require("express");
const { getProfile, updateProfile, changePassword } = require("../controllers/profileController");

const router = express.Router();

// Get user profile
router.get("/:user_id", getProfile);

// Update user profile
router.put("/:user_id", updateProfile);

// Change password
router.post("/:user_id/change-password", changePassword);

module.exports = router;
