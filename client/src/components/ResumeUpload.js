import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CloudIcon, Upload, Sparkles, Loader2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import SharedNavigation from "./SharedNavigation";
import axios from "axios";
import API_BASE_URL from "../config/api";

const ResumeUpload = () => {
  const { isDark } = useTheme();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !jobTitle || !jobDescription) {
      alert("Please fill out all fields and upload a file.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_title", jobTitle);
    formData.append("job_description", jobDescription);
    if (user.id) {
      formData.append("user_id", user.id);
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/main_job`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (res.data.status === "success") {
        navigate("/response", {
          state: {
            originalResume: res.data.data.extractedText,
            editedResume: res.data.data.editedResume,
            score: res.data.data.score,
            jobTitle: jobTitle,
            jobDescription: jobDescription,
          },
        });
      } else {
        alert(res.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "An error occurred. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Roboto', sans-serif",
      backgroundColor: isDark ? "var(--bg-primary)" : "#f5f5f7",
      transition: "background-color 0.3s ease",
    },
    main: {
      flex: 1,
      padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 4vw, 4rem)",
      backgroundColor: isDark ? "var(--bg-primary)" : "#f5f5f7",
      overflowY: "auto",
      transition: "background-color 0.3s ease",
      maxWidth: "1400px",
      margin: "0 auto",
      marginLeft: "clamp(0px, 280px, 280px)",
      width: "calc(100% - clamp(0px, 280px, 280px))",
    },
    title: {
      fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
      fontWeight: "700",
      marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
      color: isDark ? "#ffffff" : "#1d1d1f",
      letterSpacing: "-0.02em",
      lineHeight: "1.1",
    },
    content: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
      gap: "clamp(1.5rem, 3vw, 2.5rem)",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    uploadSection: {
      border: `2px dashed ${isDark ? "rgba(255,255,255,0.2)" : "#d2d2d7"}`,
      borderRadius: "18px",
      padding: "clamp(3rem, 6vw, 5rem) clamp(2rem, 4vw, 3rem)",
      textAlign: "center",
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "clamp(300px, 30vh, 400px)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
      cursor: "pointer",
    },
    uploadSectionHover: {
      borderColor: isDark ? "rgba(255,255,255,0.4)" : "#86868b",
      transform: "translateY(-4px)",
      boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.12)",
    },
    uploadIcon: {
      marginBottom: "2rem",
      color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
    },
    uploadText: {
      color: isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f",
      fontSize: "clamp(0.875rem, 1.75vw, 1rem)",
      lineHeight: "1.6",
      fontWeight: "500",
    },
    browseLink: {
      color: isDark ? "#ffffff" : "#0071e3",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "600",
      borderBottom: `2px solid ${isDark ? "#ffffff" : "#0071e3"}`,
      paddingBottom: "2px",
    },
    formSection: {
      display: "flex",
      flexDirection: "column",
      gap: "clamp(1.5rem, 3vw, 2rem)",
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      padding: "clamp(1.5rem, 3vw, 2.5rem)",
      borderRadius: "18px",
      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      transition: "all 0.3s ease",
    },
    formTitle: {
      fontSize: "clamp(1.25rem, 2.75vw, 1.5rem)",
      fontWeight: "700",
      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
      color: isDark ? "#ffffff" : "#1d1d1f",
      letterSpacing: "-0.01em",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    label: {
      fontSize: "clamp(0.8125rem, 1.75vw, 0.875rem)",
      fontWeight: "600",
      color: isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f",
      marginBottom: "0.75rem",
      letterSpacing: "-0.01em",
    },
    input: {
      padding: "clamp(0.875rem, 2vw, 1.125rem) clamp(1rem, 2vw, 1.25rem)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      borderRadius: "12px",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      backgroundColor: isDark ? "var(--bg-tertiary)" : "#ffffff",
      color: isDark ? "#ffffff" : "#1d1d1f",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      fontFamily: "inherit",
    },
    inputFocus: {
      borderColor: isDark ? "rgba(255,255,255,0.3)" : "#0071e3",
      boxShadow: isDark ? "0 0 0 4px rgba(255,255,255,0.1)" : "0 0 0 4px rgba(0,113,227,0.1)",
    },
    textarea: {
      padding: "clamp(0.875rem, 2vw, 1.125rem) clamp(1rem, 2vw, 1.25rem)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      borderRadius: "12px",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      minHeight: "clamp(150px, 20vh, 200px)",
      resize: "vertical",
      backgroundColor: isDark ? "var(--bg-tertiary)" : "#ffffff",
      color: isDark ? "#ffffff" : "#1d1d1f",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      fontFamily: "inherit",
      lineHeight: "1.6",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: "clamp(1.5rem, 3vw, 2rem)",
      gridColumn: "1 / -1",
      gap: "clamp(0.75rem, 2vw, 1rem)",
      flexWrap: "wrap",
    },
    button: {
      padding: "clamp(0.875rem, 2vw, 1.125rem) clamp(2rem, 4vw, 2.5rem)",
      backgroundColor: loading ? (isDark ? "rgba(255,255,255,0.2)" : "#d2d2d7") : (isDark ? "#ffffff" : "#1d1d1f"),
      color: loading ? (isDark ? "rgba(255,255,255,0.5)" : "#86868b") : (isDark ? "#1d1d1f" : "#ffffff"),
      border: "none",
      borderRadius: "12px",
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      fontWeight: "600",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      boxShadow: loading ? "none" : (isDark ? "0 4px 16px rgba(255,255,255,0.1)" : "0 4px 16px rgba(0,0,0,0.15)"),
      letterSpacing: "-0.01em",
    },
    buttonHover: {
      transform: "translateY(-2px) scale(1.02)",
      boxShadow: isDark ? "0 6px 24px rgba(255,255,255,0.15)" : "0 6px 24px rgba(0,0,0,0.2)",
    },
    loadingText: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      textAlign: "center",
    },
    loaderOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      transition: "opacity 0.3s ease, visibility 0.3s ease",
    },
    loaderContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
      maxWidth: "500px",
      padding: "3rem",
      textAlign: "center",
    },
    spinnerContainer: {
      position: "relative",
      width: "120px",
      height: "120px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    spinner: {
      width: "100px",
      height: "100px",
      border: `4px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      borderTop: "4px solid",
      borderTopColor: isDark ? "#ffffff" : "#1d1d1f",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    sparkleIcon: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: isDark ? "#ffffff" : "#1d1d1f",
      animation: "pulse 2s ease-in-out infinite",
    },
    loaderTitle: {
      fontSize: "clamp(1.375rem, 2.75vw, 1.875rem)",
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#1d1d1f",
      marginBottom: "0.5rem",
      letterSpacing: "-0.02em",
    },
    loaderSubtitle: {
      fontSize: "clamp(0.9375rem, 1.75vw, 1rem)",
      color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(29, 29, 31, 0.7)",
      fontWeight: "500",
      lineHeight: "1.6",
    },
    progressSteps: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      width: "100%",
      marginTop: "2rem",
    },
    progressStep: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "0.75rem 1rem",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
      borderRadius: "12px",
      transition: "all 0.3s ease",
    },
    progressStepActive: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      transform: "scale(1.02)",
    },
    progressDot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(29, 29, 31, 0.3)",
      transition: "all 0.3s ease",
    },
    progressDotActive: {
      backgroundColor: isDark ? "#ffffff" : "#1d1d1f",
      boxShadow: isDark ? "0 0 12px rgba(255, 255, 255, 0.5)" : "0 0 12px rgba(29, 29, 31, 0.3)",
      transform: "scale(1.2)",
    },
    progressText: {
      fontSize: "0.8125rem",
      color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(29, 29, 31, 0.7)",
      fontWeight: "500",
    },
    progressTextActive: {
      color: isDark ? "#ffffff" : "#1d1d1f",
      fontWeight: "600",
    },
    fileName: {
      marginTop: "1rem",
      padding: "0.75rem",
      backgroundColor: isDark ? "var(--bg-tertiary)" : "#f0f0f0",
      borderRadius: "8px",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      fontSize: "0.8125rem",
    },
  };

  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    "Uploading your resume...",
    "Extracting text from document...",
    "Analyzing job requirements...",
    "AI is tailoring your resume...",
    "Generating personalized content...",
    "Finalizing your tailored resume...",
  ];

  // Simulate processing steps
  React.useEffect(() => {
    if (loading) {
      setProcessingStep(0); // Start at first step
      
      const interval = setInterval(() => {
        setProcessingStep((prevStep) => {
          if (prevStep < processingSteps.length - 1) {
            return prevStep + 1;
          }
          return prevStep; // Keep at last step
        });
      }, 2000); // Update every 2 seconds

      return () => clearInterval(interval);
    } else {
      setProcessingStep(0); // Reset when not loading
    }
  }, [loading, processingSteps.length]);

  return (
    <div style={styles.container}>
      {loading && (
        <div style={styles.loaderOverlay}>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
              }
            `}
          </style>
          <div style={styles.loaderContainer}>
            <div style={styles.spinnerContainer}>
              <div style={styles.spinner}></div>
              <Sparkles size={40} style={styles.sparkleIcon} />
            </div>
            <div>
              <h2 style={styles.loaderTitle}>Processing Your Resume</h2>
              <p style={styles.loaderSubtitle}>
                Our AI is working its magic to tailor your resume perfectly
              </p>
            </div>
            <div style={styles.progressSteps}>
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.progressStep,
                    ...(index <= processingStep && styles.progressStepActive),
                  }}
                >
                  <div
                    style={{
                      ...styles.progressDot,
                      ...(index <= processingStep && styles.progressDotActive),
                    }}
                  />
                  <span
                    style={{
                      ...styles.progressText,
                      ...(index <= processingStep && styles.progressTextActive),
                    }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <SharedNavigation activePage="home" />
      <main style={styles.main}>
        <h1 style={styles.title}>Resume and Job Description</h1>
        <div style={styles.content}>
          <div
            style={styles.uploadSection}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.uploadSectionHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark ? "var(--border-color)" : "#ccc";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = isDark ? "var(--card-shadow)" : "var(--card-shadow)";
            }}
            onClick={handleBrowseClick}
          >
            <CloudIcon size={64} style={styles.uploadIcon} />
            <div style={styles.uploadText}>
              <strong>Drag & drop files</strong> or{" "}
              <span style={styles.browseLink}>Browse</span>
              <br />
              <span
                style={{
                  fontSize: "0.8125rem",
                  color: isDark ? "var(--text-tertiary)" : "#888",
                  marginTop: "0.5rem",
                  display: "block",
                }}
              >
                Supports format .pdf, .doc or .docx up to 50 MB
              </span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
              />
            </div>
            {fileName && (
              <div style={styles.fileName}>
                <Upload size={16} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                {fileName}
              </div>
            )}
          </div>
          <div style={styles.formSection}>
            <h2 style={styles.formTitle}>Position Details</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Title</label>
              <input
                type="text"
                style={styles.input}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Product Manager"
                onFocus={(e) => {
                  Object.assign(e.currentTarget.style, styles.inputFocus);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = isDark ? "var(--border-color)" : "#ddd";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Description</label>
              <textarea
                style={styles.textarea}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter the job description here..."
                onFocus={(e) => {
                  Object.assign(e.currentTarget.style, styles.inputFocus);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = isDark ? "var(--border-color)" : "#ddd";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <button
              style={styles.button}
              onClick={handleBrowseClick}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  Object.assign(e.currentTarget.style, styles.buttonHover);
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = loading ? "none" : (isDark ? "0 4px 16px rgba(255,255,255,0.1)" : "0 4px 16px rgba(0,0,0,0.15)");
              }}
            >
              <Upload size={18} />
              Upload File
            </button>
            <button
              style={styles.button}
              onClick={handleSubmit}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  Object.assign(e.currentTarget.style, styles.buttonHover);
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = loading ? "none" : (isDark ? "0 4px 16px rgba(255,255,255,0.1)" : "0 4px 16px rgba(0,0,0,0.15)");
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;

