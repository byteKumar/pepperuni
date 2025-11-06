import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Linkedin, Globe, Lock, Save, Edit2, Settings, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import SharedNavigation from "./SharedNavigation";
import axios from "axios";
import API_BASE_URL from "../config/api";

const Profile = () => {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState({
    studentName: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.id) {
        fetchProfile(user.id, token);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchProfile = async (userId, token) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setProfile(response.data.data.user);
      } else {
        setError(response.data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || "An error occurred while fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSaveProfile = async () => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const user = JSON.parse(userStr);
      const response = await axios.put(
        `${API_BASE_URL}/api/profile/${user.id}`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        // Update localStorage with new user data
        if (response.data.data.user) {
          const updatedUser = {
            ...user,
            email: response.data.data.user.email,
            studentName: response.data.data.user.studentName,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const user = JSON.parse(userStr);
      const response = await axios.post(
        `${API_BASE_URL}/api/profile/${user.id}/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(response.data.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError(err.response?.data?.message || "An error occurred while changing password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: isDark ? "var(--bg-primary)" : "var(--bg-secondary)",
      transition: "background-color 0.3s ease",
    },
    main: {
      flex: 1,
      padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 4vw, 4rem)",
      backgroundColor: isDark ? "var(--bg-primary)" : "#f5f5f7",
      overflowY: "auto",
      transition: "background-color 0.3s ease",
      marginLeft: "clamp(0px, 280px, 280px)",
      width: "calc(100% - clamp(0px, 280px, 280px))",
    },
    title: {
      fontSize: "clamp(1.5rem, 3.5vw, 1.875rem)",
      fontWeight: "700",
      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      letterSpacing: "-0.5px",
    },
    section: {
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      borderRadius: "12px",
      padding: "clamp(1.5rem, 3vw, 2.5rem)",
      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
      boxShadow: isDark ? "var(--card-shadow)" : "var(--card-shadow)",
      border: `1px solid ${isDark ? "var(--border-color)" : "#e0e0e0"}`,
      transition: "all 0.3s ease",
    },
    sectionTitle: {
      fontSize: "clamp(1.125rem, 2.75vw, 1.375rem)",
      fontWeight: "600",
      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    formGroup: {
      marginBottom: "1.75rem",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
      fontSize: "0.8125rem",
      fontWeight: "600",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      marginBottom: "0.75rem",
    },
    input: {
      width: "100%",
      padding: "clamp(0.875rem, 2vw, 1rem)",
      border: `1px solid ${isDark ? "var(--border-color)" : "#ddd"}`,
      borderRadius: "8px",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      backgroundColor: isDark ? "var(--bg-tertiary)" : "#ffffff",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      transition: "all 0.2s ease",
      outline: "none",
    },
    inputFocus: {
      borderColor: isDark ? "#666" : "#999",
      boxShadow: `0 0 0 3px ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
    },
    inputDisabled: {
      backgroundColor: isDark ? "var(--bg-tertiary)" : "#f5f5f5",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    button: {
      padding: "clamp(0.875rem, 2vw, 1rem) clamp(1.75rem, 3vw, 2rem)",
      backgroundColor: isDark ? "#ffffff" : "#1d1d1f",
      color: isDark ? "#1d1d1f" : "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
    },
    buttonSecondary: {
      backgroundColor: isDark ? "#333" : "#666",
      color: isDark ? "#ffffff" : "#ffffff",
    },
    errorMessage: {
      padding: "1rem",
      backgroundColor: isDark ? "rgba(244, 67, 54, 0.1)" : "#ffebee",
      color: isDark ? "#ff6b6b" : "#c62828",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      border: `1px solid ${isDark ? "rgba(244, 67, 54, 0.3)" : "#ffcdd2"}`,
    },
    successMessage: {
      padding: "1rem",
      backgroundColor: isDark ? "rgba(76, 175, 80, 0.1)" : "#e8f5e9",
      color: isDark ? "#81c784" : "#2e7d32",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      border: `1px solid ${isDark ? "rgba(76, 175, 80, 0.3)" : "#c8e6c9"}`,
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
      marginBottom: "0.75rem",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      fontSize: "0.875rem",
    },
    editButton: {
      marginLeft: "auto",
      backgroundColor: "transparent",
      border: `1px solid ${isDark ? "var(--border-color)" : "#ddd"}`,
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
    },
    buttonContainer: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <SharedNavigation activePage="profile" />
        <main style={styles.main}>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)" }}>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <SharedNavigation activePage="profile" />
      <main style={styles.main}>
        <h1 style={styles.title}>My Profile</h1>

        {/* Profile Information Section */}
        <div style={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={styles.sectionTitle}>
              Personal Information
            </h2>
            {!isEditing && (
              <button
                style={{ ...styles.button, ...styles.editButton }}
                onClick={() => setIsEditing(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = isDark 
                    ? "0 4px 12px rgba(0,0,0,0.3)" 
                    : "0 4px 12px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "#999";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = isDark ? "var(--border-color)" : "#ddd";
                }}
              >
                <Edit2 size={16} />
                Edit
              </button>
            )}
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {success && <div style={styles.successMessage}>{success}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              name="studentName"
              value={profile.studentName}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{
                ...styles.input,
                ...(!isEditing && styles.inputDisabled),
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{
                ...styles.input,
                ...(!isEditing && styles.inputDisabled),
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Phone size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              disabled={!isEditing}
              style={{
                ...styles.input,
                ...(!isEditing && styles.inputDisabled),
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Linkedin size={16} />
              LinkedIn Profile
            </label>
            <input
              type="url"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
              disabled={!isEditing}
              style={{
                ...styles.input,
                ...(!isEditing && styles.inputDisabled),
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Globe size={16} />
              Portfolio/Website
            </label>
            <input
              type="url"
              name="portfolio"
              value={profile.portfolio}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
              disabled={!isEditing}
              style={{
                ...styles.input,
                ...(!isEditing && styles.inputDisabled),
              }}
            />
          </div>

          {isEditing && (
            <div style={styles.buttonContainer}>
              <button
                style={styles.button}
                onClick={handleSaveProfile}
                disabled={saving}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow = isDark 
                      ? "0 6px 20px rgba(255,255,255,0.15)" 
                      : "0 6px 20px rgba(0,0,0,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setSuccess("");
                  // Reload profile to reset changes
                  const userStr = localStorage.getItem("user");
                  if (userStr) {
                    const user = JSON.parse(userStr);
                    const token = localStorage.getItem("token");
                    if (user.id && token) {
                      fetchProfile(user.id, token);
                    }
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = isDark 
                    ? "0 6px 16px rgba(0,0,0,0.3)" 
                    : "0 6px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Account Settings Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Lock size={24} />
            Change Password
          </h2>

          {passwordError && <div style={styles.errorMessage}>{passwordError}</div>}
          {passwordSuccess && <div style={styles.successMessage}>{passwordSuccess}</div>}

          <form onSubmit={handlePasswordChange}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={16} />
                Current Password
              </label>
              <div style={{ position: "relative" }}>
              <input
                  type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, currentPassword: e.target.value });
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                  style={{ ...styles.input, paddingRight: "2.75rem" }}
                required
              />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "35%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isDark ? "#ffffff" : "#1d1d1f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.7)" : "#86868b";
                  }}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={16} />
                New Password
              </label>
              <div style={{ position: "relative" }}>
              <input
                  type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value });
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                  style={{ ...styles.input, paddingRight: "2.75rem" }}
                required
                minLength={6}
              />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "35%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isDark ? "#ffffff" : "#1d1d1f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.7)" : "#86868b";
                  }}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={16} />
                Confirm New Password
              </label>
              <div style={{ position: "relative" }}>
              <input
                  type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                  style={{ ...styles.input, paddingRight: "2.75rem" }}
                required
                minLength={6}
              />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "35%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isDark ? "#ffffff" : "#1d1d1f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.7)" : "#86868b";
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={changingPassword}
              onMouseEnter={(e) => {
                if (!changingPassword) {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow = isDark 
                    ? "0 6px 20px rgba(255,255,255,0.15)" 
                    : "0 6px 20px rgba(0,0,0,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              }}
            >
              <Lock size={16} />
              {changingPassword ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Account Information Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Settings size={24} />
            Account Information
          </h2>
          <div style={styles.infoRow}>
            <strong>Account Created:</strong> {formatDate(profile.createdAt)}
          </div>
          <div style={styles.infoRow}>
            <strong>Last Updated:</strong> {formatDate(profile.updatedAt)}
          </div>
          <div style={styles.infoRow}>
            <strong>User ID:</strong> {profile.id}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

