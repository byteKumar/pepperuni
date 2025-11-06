import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "./Login.css";

const Login = () => {
  const { isDark } = useTheme();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.status === 200) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/resumeupload");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Invalid email or password.";
      setLoginError(errorMsg);
      console.error("Login error:", error);
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
            <h2 className="title">Sign In</h2>
            <p className="subtitle">
              Don't have an account? <Link to="/signup">Create an Account</Link>
            </p>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  id="email"
                  type="email"
                  placeholder="xxxx@northeastern.edu"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password*</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
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
              </div>
              {loginError && <p style={{ color: isDark ? "#ff6b6b" : "#c62828", marginTop: "0.75rem", padding: "0.75rem", backgroundColor: isDark ? "rgba(244, 67, 54, 0.1)" : "#ffebee", borderRadius: "8px", border: `1px solid ${isDark ? "rgba(244, 67, 54, 0.3)" : "#ffcdd2"}`, fontSize: "0.875rem" }}>{loginError}</p>}
              <button type="submit" className="button" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
