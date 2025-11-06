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

    const { job_title, company, job_description, user_id } = req.body;
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
    const editedResumeText = editResult.data.editedResume || "";
    
    // Try multiple patterns to extract score
    const scorePatterns = [
      /Total Score[:\s]*(\d+)/i,
      /Score[:\s]*(\d+)\s*\/\s*100/i,
      /Score[:\s]*(\d+)/i,
      /(\d+)\s*\/\s*100/i,
      /Score:\s*(\d+)/i,
      /Total Score:\s*(\d+)/i,
    ];
    
    for (const pattern of scorePatterns) {
      const match = editedResumeText.match(pattern);
      if (match && match[1]) {
        const extractedScore = parseInt(match[1]);
        if (extractedScore >= 0 && extractedScore <= 100) {
          score = extractedScore.toString();
          console.log(`Score extracted: ${score} using pattern: ${pattern}`);
          break;
        }
      }
    }
    
    if (score === "N/A") {
      console.log("Warning: Could not extract score from AI response");
    }

    // Save resume to database if user_id is provided
    if (user_id) {
      try {
        const resume = new Resume({
          user_id,
          filename: req.file.originalname || req.file.filename,
          job_title: job_title || "Untitled",
          company: company || "",
          job_description: job_description || "",
          original_resume: resumeText, // Store original extracted text
          resume: editResult.data.editedResume, // Store edited/tailored resume
          score: score,
          created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        await resume.save();
        
        // Keep only the last 5 resumes for this user
        const userResumes = await Resume.find({ user_id })
          .sort({ created_date: -1 })
          .exec();
        
        if (userResumes.length > 5) {
          // Delete resumes beyond the 5 most recent
          const resumesToDelete = userResumes.slice(5);
          const idsToDelete = resumesToDelete.map(r => r._id);
          await Resume.deleteMany({ _id: { $in: idsToDelete } });
          console.log(`Deleted ${resumesToDelete.length} old resume(s) for user ${user_id}`);
        }
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

/**
 * Get all resumes for a user
 */
exports.getUserResumes = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    console.log("Getting resumes for user_id:", user_id);
    
    if (!user_id) {
      console.log("User ID missing in request");
      return res.status(400).json({ 
        status: "error",
        message: "User ID is required" 
      });
    }

    console.log("Querying database for user_id:", user_id);
    const resumes = await Resume.find({ user_id })
      .sort({ created_date: -1 }) // Sort by newest first
      .limit(5) // Limit to last 5 resumes
      .exec();

    console.log(`Found ${resumes.length} resumes for user ${user_id}`);

    return res.status(200).json({
      status: "success",
      message: "Resumes fetched successfully",
      data: {
        resumes: resumes,
        count: resumes.length,
      },
    });
  } catch (err) {
    console.error("Error fetching resumes:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      status: "error",
      message: "An error occurred while fetching resumes", 
      error: err.message 
    });
  }
};

/**
 * Delete a resume by ID
 */
exports.deleteResume = async (req, res) => {
  try {
    const { resume_id } = req.params;
    const user_id = req.user?.id; // Get user_id from auth middleware
    
    console.log("Deleting resume:", resume_id, "for user:", user_id);
    
    if (!resume_id) {
      return res.status(400).json({ 
        status: "error",
        message: "Resume ID is required" 
      });
    }

    if (!user_id) {
      return res.status(401).json({ 
        status: "error",
        message: "Authentication required" 
      });
    }

    // Find the resume to ensure it exists and belongs to the user
    const resume = await Resume.findById(resume_id);
    
    if (!resume) {
      return res.status(404).json({ 
        status: "error",
        message: "Resume not found" 
      });
    }

    // Verify the resume belongs to the user
    if (resume.user_id !== user_id.toString()) {
      return res.status(403).json({ 
        status: "error",
        message: "You don't have permission to delete this resume" 
      });
    }

    // Delete the resume
    await Resume.findByIdAndDelete(resume_id);
    
    console.log(`Resume ${resume_id} deleted successfully`);

    return res.status(200).json({
      status: "success",
      message: "Resume deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting resume:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      status: "error",
      message: "An error occurred while deleting the resume", 
      error: err.message 
    });
  }
};
