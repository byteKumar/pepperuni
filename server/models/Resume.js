const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  filename: String,
  job_title: String,
  job_description: String,
  original_resume: String, // Store the original extracted text
  resume: String, // Store the edited/tailored resume
  score: String,
  created_date: String,
});

module.exports = mongoose.model("Resume", ResumeSchema);
