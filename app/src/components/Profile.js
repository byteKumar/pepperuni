import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LayoutGrid, FileDown, User2, Settings, Mail, Phone, Linkedin, Globe, Lock, Save, Edit2 } from "lucide-react";
import axios from "axios";

const Profile = () => {
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
        `http://localhost:5001/api/profile/${userId}`,
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
        `http://localhost:5001/api/profile/${user.id}`,
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
        `http://localhost:5001/api/profile/${user.id}/change-password`,
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
    },
    sidebar: {
      width: "240px",
      backgroundColor: "#000",
      color: "white",
      padding: "1.5rem",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "2rem",
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    navItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      color: "#888",
      textDecoration: "none",
      fontSize: "1rem",
      cursor: "pointer",
    },
    activeNavItem: {
      color: "white",
      fontWeight: "600",
    },
    main: {
      flex: 1,
      padding: "2rem",
      backgroundColor: "#f5f5f5",
      overflowY: "auto",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "1rem",
      color: "#333",
    },
    section: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "2rem",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#666",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "1rem",
      transition: "border-color 0.2s",
    },
    inputFocus: {
      borderColor: "#000",
      outline: "none",
    },
    inputDisabled: {
      backgroundColor: "#f5f5f5",
      cursor: "not-allowed",
    },
    button: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "#000",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "background-color 0.2s",
    },
    buttonHover: {
      backgroundColor: "#333",
    },
    buttonSecondary: {
      backgroundColor: "#666",
    },
    errorMessage: {
      padding: "0.75rem",
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderRadius: "4px",
      marginBottom: "1rem",
    },
    successMessage: {
      padding: "0.75rem",
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      borderRadius: "4px",
      marginBottom: "1rem",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.5rem",
      color: "#666",
    },
    editButton: {
      marginLeft: "auto",
      backgroundColor: "transparent",
      border: "1px solid #ddd",
      color: "#333",
    },
    buttonContainer: {
      display: "flex",
      gap: "1rem",
      marginTop: "1.5rem",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <aside style={styles.sidebar}>
          <div style={styles.logo}>PepperUni</div>
        </aside>
        <main style={styles.main}>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#666" }}>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>PepperUni</div>
        <nav style={styles.nav}>
          <Link to="/resumeupload" style={styles.navItem}>
            <LayoutGrid /> Home
          </Link>
          <Link to="/resume" style={styles.navItem}>
            <FileDown /> Resume
          </Link>
          <div style={{ ...styles.navItem, ...styles.activeNavItem }}>
            <User2 /> Profile
          </div>
          <div style={styles.navItem} onClick={handleLogout}>
            Logout
          </div>
        </nav>
      </aside>
      <main style={styles.main}>
        <h1 style={styles.title}>My Profile</h1>

        {/* Profile Information Section */}
        <div style={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={styles.sectionTitle}>
              <User2 size={24} />
              Personal Information
            </h2>
            {!isEditing && (
              <button
                style={{ ...styles.button, ...styles.editButton }}
                onClick={() => setIsEditing(true)}
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
              <User2 size={16} />
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
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, currentPassword: e.target.value });
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={16} />
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value });
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                style={styles.input}
                required
                minLength={6}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={16} />
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                style={styles.input}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={changingPassword}
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

