const User = require("../models/User");
const bcrypt = require("bcrypt");

/**
 * Get user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ 
        status: "error",
        message: "User ID is required" 
      });
    }

    const user = await User.findById(user_id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: "User not found" 
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      data: {
        user: {
          id: user._id,
          studentName: user.studentName,
          email: user.email,
          phone: user.phone || "",
          linkedin: user.linkedin || "",
          portfolio: user.portfolio || "",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ 
      status: "error",
      message: "An error occurred while fetching profile",
      error: err.message 
    });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { studentName, email, phone, linkedin, portfolio } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ 
        status: "error",
        message: "User ID is required" 
      });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: "User not found" 
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ 
          status: "error",
          message: "Email already exists" 
        });
      }
      user.email = email;
    }

    // Update fields
    if (studentName) user.studentName = studentName;
    if (phone !== undefined) user.phone = phone;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    user.updatedAt = new Date();

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          studentName: user.studentName,
          email: user.email,
          phone: user.phone || "",
          linkedin: user.linkedin || "",
          portfolio: user.portfolio || "",
        },
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ 
      status: "error",
      message: "An error occurred while updating profile",
      error: err.message 
    });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ 
        status: "error",
        message: "User ID is required" 
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        status: "error",
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        status: "error",
        message: "New password must be at least 6 characters long" 
      });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: "User not found" 
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        status: "error",
        message: "Current password is incorrect" 
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date();

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ 
      status: "error",
      message: "An error occurred while changing password",
      error: err.message 
    });
  }
};
