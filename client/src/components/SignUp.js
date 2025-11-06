import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "./Login.css";

const SignUp = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!formData.studentName.trim()) errors.studentName = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        studentName: formData.studentName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        alert("Account successfully created! Please login.");
        navigate("/login");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "An error occurred. Please try again.";
      setErrorMessage(errorMsg);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="left-content">
          <div className="logo">PepperUni</div>
          <h1 className="hero-title">
            Transform Your Resume<br />
            Into Interview Gold
          </h1>
          <p className="hero-description">
            Get instant, AI-powered feedback on your resume tailored to each job application. 
            Our intelligent system analyzes your resume against job descriptions, suggests improvements, 
            and helps you land more interviews.
          </p>
          <div className="features">
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Instant resume scoring</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Job-specific recommendations</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>ATS optimization</span>
            </div>
          </div>
        </div>
      </div>
      <div className="right-section">
        <div className="form-container">
        <div className="form">
          <h2 className="title">Create your account</h2>
          <p className="subtitle">
              Already have an account? <Link to="/login">Sign In</Link>
          </p>
          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <label htmlFor="name">Full Name*</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.studentName}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                required
              />
              {errors.studentName && (
                <p style={{ color: isDark ? "#ff6b6b" : "#c62828", marginTop: "0.5rem", fontSize: "0.8125rem" }}>{errors.studentName}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address*</label>
              <input
                id="email"
                type="email"
                placeholder="xxxx@northeastern.edu"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              {errors.email && <p style={{ color: isDark ? "#ff6b6b" : "#c62828", marginTop: "0.5rem", fontSize: "0.8125rem" }}>{errors.email}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="password">Password*</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: isDark ? "#ff6b6b" : "#c62828", marginTop: "0.5rem", fontSize: "0.8125rem" }}>{errors.password}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password*</label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  style={{ paddingRight: "2.75rem" }}
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
              {errors.confirmPassword && (
                <p style={{ color: isDark ? "#ff6b6b" : "#c62828", marginTop: "0.5rem", fontSize: "0.8125rem" }}>{errors.confirmPassword}</p>
              )}
            </div>
            {errorMessage && <p style={{ color: isDark ? "#ff6b6b" : "#c62828", marginTop: "0.75rem", padding: "0.75rem", backgroundColor: isDark ? "rgba(244, 67, 54, 0.1)" : "#ffebee", borderRadius: "8px", border: `1px solid ${isDark ? "rgba(244, 67, 54, 0.3)" : "#ffcdd2"}`, fontSize: "0.875rem" }}>{errorMessage}</p>}
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
