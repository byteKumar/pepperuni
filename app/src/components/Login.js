import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/auth/signin", {
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
      <div className="sidebar">
        <h1>PepperUni</h1>
        <p>Build a Winning Product Resume with AI Expertise</p>
      </div>
      <main className="main">
        <div className="form">
          <h2 className="title">Sign In</h2>
          <p className="subtitle">
            Do not have an account? <Link to="/signup">Create an Account</Link>
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
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
            {loginError && <p style={{ color: "red", marginTop: "0.5rem" }}>{loginError}</p>}
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
