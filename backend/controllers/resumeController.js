const fs = require("fs");
const { extractTextFromPDF } = require("../services/pdfService");
const editResumeController = require("./editResumeController");
const editResume = editResumeController.editResume;
const Resume = require("../models/Resume");
const moment = require("moment");

exports.mainJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        status: "error",
        message: "No file uploaded" 
      });
    }

    const { job_title, job_description, user_id } = req.body;
    const filePath = req.file.path;

    if (!job_description) {
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        status: "error",
        message: "Job description is required" 
      });
    }

    // Extract text from PDF
    const pdfData = await extractTextFromPDF(filePath);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        status: "error",
        message: "Could not extract text from PDF. Please ensure the PDF contains readable text." 
      });
    }

    // Process resume with OpenAI
    const editResult = await editResume(resumeText, job_description);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    if (editResult.status === "error") {
      return res.status(500).json(editResult);
    }

    // Extract score from the edited resume (if available)
    let score = "N/A";
    const scoreMatch = editResult.data.editedResume.match(/Total Score[:\s]*(\d+)/i);
    if (scoreMatch) {
      score = scoreMatch[1];
    }

    // Save resume to database if user_id is provided
    if (user_id) {
      try {
        const resume = new Resume({
          user_id,
          filename: req.file.originalname || req.file.filename,
          job_title: job_title || "Untitled",
          resume: editResult.data.editedResume,
          score: score,
          created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        await resume.save();
      } catch (dbError) {
        console.error("Error saving resume to database:", dbError);
        // Continue even if database save fails
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Resume processed successfully",
      data: {
        extractedText: resumeText,
        editedResume: editResult.data.editedResume,
        score: score,
      },
    });
  } catch (err) {
    console.error("Error in mainJob:", err);
    // Clean up file if it still exists
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }
    res.status(500).json({ 
      status: "error",
      message: "An error occurred", 
      error: err.message 
    });
  }
};
