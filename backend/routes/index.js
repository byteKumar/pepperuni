const express = require("express");
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const resumeRoutes = require("./resumeRoutes");
const editResumeRoutes = require("./editResumeRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/", resumeRoutes); // Changed to root since it's already /api/main_job
router.use("/resumes", editResumeRoutes);

module.exports = router;
