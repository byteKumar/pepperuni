import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Calendar, TrendingUp, FileText, Trash2, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import SharedNavigation from "./SharedNavigation";
import axios from "axios";
import API_BASE_URL from "../config/api";

const ResumeList = () => {
  const { isDark } = useTheme();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { resumeId, resumeTitle }
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    console.log("User from localStorage:", userStr);
    console.log("Token exists:", !!token);

    if (!token || !userStr) {
      console.log("No token or user, redirecting to login");
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("Parsed user:", user);
      
      if (!user.id) {
        console.log("No user.id found, redirecting to login");
        navigate("/login");
        return;
      }

      // Fetch user resumes
      console.log("Calling fetchResumes with user.id:", user.id);
      fetchResumes(user.id, token);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchResumes = async (userId, token) => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching resumes for user:", userId);
      const response = await axios.get(
        `${API_BASE_URL}/api/resumes/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resume fetch response:", response.data);
      if (response.data.status === "success") {
        setResumes(response.data.data.resumes || []);
      } else {
        setError(response.data.message || "Failed to fetch resumes");
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "An error occurred while fetching resumes";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getScoreColor = (score) => {
    if (!score || score === "N/A") return "#666";
    const scoreNum = parseInt(score);
    if (scoreNum >= 80) return "#4caf50"; // Green
    if (scoreNum >= 60) return "#ff9800"; // Orange
    return "#f44336"; // Red
  };

  // Extract score from resume text if score field is missing
  const extractScoreFromText = (resumeText) => {
    if (!resumeText) return null;
    
    const scorePatterns = [
      /Total Score[:\s]*(\d+)/i,
      /Score[:\s]*(\d+)\s*\/\s*100/i,
      /Score[:\s]*(\d+)/i,
      /(\d+)\s*\/\s*100/i,
      /Score:\s*(\d+)/i,
      /Total Score:\s*(\d+)/i,
    ];
    
    for (const pattern of scorePatterns) {
      const match = resumeText.match(pattern);
      if (match && match[1]) {
        const extractedScore = parseInt(match[1]);
        if (extractedScore >= 0 && extractedScore <= 100) {
          return extractedScore.toString();
        }
      }
    }
    return null;
  };

  const handleViewResume = (resumeData) => {
    navigate("/response", {
      state: {
        editedResume: resumeData.resume,
        originalResume: resumeData.original_resume || null,
        score: resumeData.score,
        jobTitle: resumeData.job_title,
        jobDescription: resumeData.job_description || "",
      },
    });
  };

  const handleDownload = (resumeData, e) => {
    e.stopPropagation();
    if (!resumeData.resume) return;

    const blob = new Blob([resumeData.resume], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_${resumeData.job_title || "resume"}_${resumeData.created_date || new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (resumeData, e) => {
    e.stopPropagation();
    setDeleteConfirm({
      resumeId: resumeData._id,
      resumeTitle: resumeData.job_title || "Untitled Resume",
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/resumes/delete/${deleteConfirm.resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        // Remove the deleted resume from the list
        setResumes((prevResumes) =>
          prevResumes.filter((r) => r._id !== deleteConfirm.resumeId)
        );
        setDeleteConfirm(null);
      } else {
        setError(response.data.message || "Failed to delete resume");
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Error deleting resume:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred while deleting the resume";
      setError(errorMessage);
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Inter, -apple-system, sans-serif",
      backgroundColor: isDark ? "var(--bg-primary)" : "var(--bg-secondary)",
      transition: "background-color 0.3s ease",
    },
    main: {
      flex: 1,
      padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 4vw, 4rem)",
      backgroundColor: isDark ? "var(--bg-primary)" : "#f5f5f7",
      overflowY: "auto",
      transition: "background-color 0.3s ease",
      marginLeft: "30%",
      width: "70%",
    },
    title: {
      fontSize: "clamp(1.25rem, 3vw, 1.625rem)",
      fontWeight: "700",
      marginBottom: "0.5rem",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      letterSpacing: "-0.5px",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    subtitle: {
      fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      marginBottom: "clamp(1.25rem, 2.5vw, 2rem)",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
    },
    errorContainer: {
      padding: "1.25rem",
      backgroundColor: isDark ? "rgba(244, 67, 54, 0.1)" : "#ffebee",
      color: isDark ? "#ff6b6b" : "#c62828",
      borderRadius: "12px",
      marginBottom: "1.5rem",
      border: `1px solid ${isDark ? "rgba(244, 67, 54, 0.3)" : "#ffcdd2"}`,
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem 2rem",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
    },
    resumeGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
      gap: "clamp(1.5rem, 3vw, 2rem)",
    },
    resumeCard: {
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      borderRadius: "12px",
      padding: "clamp(1.5rem, 3vw, 2rem)",
      boxShadow: isDark ? "var(--card-shadow)" : "var(--card-shadow)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: `1px solid ${isDark ? "var(--border-color)" : "#e0e0e0"}`,
    },
    resumeCardHover: {
      transform: "translateY(-4px)",
      boxShadow: isDark ? "var(--card-hover-shadow)" : "var(--card-hover-shadow)",
    },
    resumeHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1.25rem",
    },
    resumeTitle: {
      fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)",
      fontWeight: "600",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      margin: 0,
      flex: 1,
      lineHeight: "1.4",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    scoreBadge: {
      padding: "clamp(0.5rem, 1.5vw, 0.625rem) clamp(1rem, 2vw, 1.25rem)",
      borderRadius: "24px",
      color: "white",
      fontWeight: "600",
      fontSize: "clamp(0.6875rem, 1.25vw, 0.75rem)",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    resumeMeta: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      marginBottom: "1.25rem",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      fontSize: "0.75rem",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    resumePreview: {
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      fontSize: "0.75rem",
      lineHeight: "1.6",
      maxHeight: "120px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginBottom: "1.25rem",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    resumeActions: {
      display: "flex",
      gap: "0.75rem",
      justifyContent: "flex-end",
    },
    actionButton: {
      padding: "clamp(0.5625rem, 1.375vw, 0.6875rem) clamp(1.125rem, 1.875vw, 1.375rem)",
      backgroundColor: isDark ? "#ffffff" : "#000000",
      color: isDark ? "#1d1d1f" : "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "clamp(0.6875rem, 1.25vw, 0.75rem)",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    actionButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    },
    deleteButton: {
      padding: "clamp(0.5625rem, 1.375vw, 0.6875rem) clamp(1.125rem, 1.875vw, 1.375rem)",
      backgroundColor: isDark ? "rgba(244, 67, 54, 0.1)" : "#ffebee",
      color: isDark ? "#ff6b6b" : "#c62828",
      border: `1px solid ${isDark ? "rgba(244, 67, 54, 0.3)" : "#ffcdd2"}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "clamp(0.6875rem, 1.25vw, 0.75rem)",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s ease",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    deleteButtonHover: {
      backgroundColor: isDark ? "rgba(244, 67, 54, 0.2)" : "#ffcdd2",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(244, 67, 54, 0.3)",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      animation: "fadeIn 0.2s ease",
    },
    modalContent: {
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      borderRadius: "20px",
      padding: "clamp(1.5rem, 3vw, 2.5rem)",
      maxWidth: "450px",
      width: "90%",
      boxShadow: isDark
        ? "0 20px 60px rgba(0,0,0,0.5)"
        : "0 20px 60px rgba(0,0,0,0.2)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      animation: "slideUp 0.3s ease",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    modalTitle: {
      fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
      fontWeight: "700",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      margin: 0,
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    modalCloseButton: {
      background: "none",
      border: "none",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    modalMessage: {
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      marginBottom: "2rem",
      lineHeight: "1.6",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    modalButtons: {
      display: "flex",
      gap: "0.75rem",
      justifyContent: "flex-end",
    },
    modalButton: {
      padding: "clamp(0.75rem, 1.5vw, 0.875rem) clamp(1.5rem, 3vw, 2rem)",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      fontWeight: "600",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      letterSpacing: "-0.01em",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    modalButtonCancel: {
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7",
      color: isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f",
    },
    modalButtonDelete: {
      backgroundColor: isDark ? "rgba(244, 67, 54, 0.2)" : "#ffebee",
      color: isDark ? "#ff6b6b" : "#c62828",
    },
  };

  return (
    <div style={styles.container}>
      <SharedNavigation activePage="resume" />
      <main style={styles.main}>
        <h1 style={styles.title}>My Resumes</h1>
        <p style={styles.subtitle}>
          View all your tailored resumes, scores, and history
        </p>

        {loading ? (
          <div style={styles.loadingContainer}>
            <p style={{ color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)", fontSize: "0.875rem", fontFamily: "Inter, -apple-system, sans-serif" }}>
              Loading resumes...
            </p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <strong>Error:</strong> {error}
          </div>
        ) : resumes.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText size={80} style={{ marginBottom: "1.5rem", color: isDark ? "var(--text-tertiary)" : "#ccc", opacity: 0.5 }} />
            <h2 style={{ color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)", marginBottom: "0.75rem", fontSize: "clamp(1.125rem, 2.5vw, 1.25rem)", fontFamily: "Inter, -apple-system, sans-serif" }}>
              No resumes yet
            </h2>
            <p style={{ color: isDark ? "var(--text-tertiary)" : "#999", marginBottom: "2rem", fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)", fontFamily: "Inter, -apple-system, sans-serif" }}>
              Start by uploading and tailoring your first resume!
            </p>
            <button
              onClick={() => navigate("/resumeupload")}
              style={{
                ...styles.actionButton,
                display: "inline-flex",
              }}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.actionButtonHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
              }}
            >
              <FileText size={18} />
              Upload Resume
            </button>
          </div>
        ) : (
          <>
            {/* Summary Section - Redesigned */}
            {(() => {
              // Get the most recent resume (previous resume)
              const previousResume = resumes[0];
              const previousScore = previousResume?.score || extractScoreFromText(previousResume?.resume) || "N/A";
              
              // Calculate highest score from all resumes
              const scores = resumes.map(r => {
                const score = r.score || extractScoreFromText(r.resume);
                return score && score !== "N/A" ? parseInt(score) : 0;
              });
              const highestScore = scores.length > 0 ? Math.max(...scores) : "N/A";
              
              return (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                  gap: "clamp(1rem, 2vw, 1.5rem)",
                  marginBottom: "clamp(2rem, 4vw, 3rem)",
                }}>
                  {/* Previous Resume Score Card */}
                  {previousResume && previousScore !== "N/A" && (
                    <div style={{
                      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
                      borderRadius: "16px",
                      padding: "clamp(1.5rem, 3vw, 2rem)",
                      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
                      border: `1px solid ${isDark ? "var(--border-color)" : "#e0e0e0"}`,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "-20px",
                        right: "-20px",
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${getScoreColor(previousScore)}20, ${getScoreColor(previousScore)}05)`,
                        opacity: 0.5,
                      }} />
                      <div style={{
                        fontSize: "clamp(0.75rem, 1.5vw, 0.8125rem)",
                        color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
                        marginBottom: "0.75rem",
                        fontWeight: "500",
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                        fontFamily: "Inter, -apple-system, sans-serif",
                      }}>
                        Previous Resume
                      </div>
                      <div style={{
                        fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                        fontWeight: "700",
                        color: getScoreColor(previousScore),
                        marginBottom: "0.5rem",
                        lineHeight: "1.2",
                        fontFamily: "Inter, -apple-system, sans-serif",
                      }}>
                        {previousScore}/100
                      </div>
                      <div style={{
                        fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)",
                        color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
                        lineHeight: "1.5",
                        fontFamily: "Inter, -apple-system, sans-serif",
                      }}>
                        Your previous resume scored <strong style={{ color: getScoreColor(previousScore) }}>"{previousScore}"</strong>.
                      </div>
                    </div>
                  )}
                  
                  {/* Highest Score Card */}
                  {highestScore !== "N/A" && highestScore > 0 && (
                    <div style={{
                      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
                      borderRadius: "16px",
                      padding: "clamp(1.5rem, 3vw, 2rem)",
                      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
                      border: `1px solid ${isDark ? "var(--border-color)" : "#e0e0e0"}`,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "-20px",
                        right: "-20px",
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${getScoreColor(highestScore.toString())}20, ${getScoreColor(highestScore.toString())}05)`,
                        opacity: 0.5,
                      }} />
                      <div style={{
                        fontSize: "clamp(0.75rem, 1.5vw, 0.8125rem)",
                        color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
                        marginBottom: "0.75rem",
                        fontWeight: "500",
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                        fontFamily: "Inter, -apple-system, sans-serif",
                      }}>
                        Best Performance
                      </div>
                      <div style={{
                        fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                        fontWeight: "700",
                        color: getScoreColor(highestScore.toString()),
                        marginBottom: "0.5rem",
                        lineHeight: "1.2",
                        fontFamily: "Inter, -apple-system, sans-serif",
                      }}>
                        {highestScore}/100
                      </div>
                      <div style={{
                        fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)",
                        color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
                        lineHeight: "1.5",
                        fontFamily: "Inter, -apple-system, sans-serif",
                      }}>
                        Your highest score over the last 5 uploads is <strong style={{ color: getScoreColor(highestScore.toString()) }}>"{highestScore}"</strong>.
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            
            {/* Section Header */}
            <div style={{
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
              paddingBottom: "1rem",
              borderBottom: `2px solid ${isDark ? "var(--border-color)" : "#e0e0e0"}`,
            }}>
              <h2 style={{
                fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
                fontWeight: "700",
                color: isDark ? "var(--text-primary)" : "var(--text-primary)",
                margin: 0,
                letterSpacing: "-0.01em",
                fontFamily: "Inter, -apple-system, sans-serif",
              }}>
                Track your last five resume uploads.
              </h2>
            </div>
            
            <div style={styles.resumeGrid}>
              {resumes.map((resume, index) => (
                <div
                  key={resume._id || index}
                  style={styles.resumeCard}
                  onClick={() => handleViewResume(resume)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.resumeCardHover);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = isDark ? "var(--card-shadow)" : "var(--card-shadow)";
                  }}
                >
                  <div style={styles.resumeHeader}>
                    <h3 style={styles.resumeTitle}>
                      {resume.job_title || "Untitled Resume"}
                    </h3>
                    {(() => {
                      // Try to get score from resume.score field, or extract from resume text
                      let displayScore = resume.score;
                      if (!displayScore || displayScore === "N/A" || displayScore === null) {
                        displayScore = extractScoreFromText(resume.resume);
                      }
                      
                      if (displayScore && displayScore !== "N/A" && displayScore !== null) {
                        return (
                      <div
                        style={{
                          ...styles.scoreBadge,
                              backgroundColor: getScoreColor(displayScore),
                        }}
                      >
                        <TrendingUp size={16} />
                            {displayScore}/100
                      </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  <div style={styles.resumeMeta}>
                    <div style={styles.metaItem}>
                      <Calendar size={16} />
                      {formatDate(resume.created_date)}
                    </div>
                    {resume.filename && (
                      <div style={styles.metaItem}>
                        <FileText size={16} />
                        {resume.filename}
                      </div>
                    )}
                  </div>

                  {resume.resume && (
                    <div style={styles.resumePreview}>
                      {resume.resume.substring(0, 150)}...
                    </div>
                  )}

                  <div style={styles.resumeActions}>
                    <button
                      style={styles.deleteButton}
                      onClick={(e) => handleDeleteClick(resume, e)}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, styles.deleteButtonHover);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.backgroundColor = isDark ? "rgba(244, 67, 54, 0.1)" : "#ffebee";
                      }}
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                    <button
                      style={styles.actionButton}
                      onClick={(e) => handleDownload(resume, e)}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, styles.actionButtonHover);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
                      }}
                    >
                      <Download size={18} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <style>
            {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
          <div
            style={styles.modalOverlay}
            onClick={handleDeleteCancel}
          >
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Delete Resume</h3>
                <button
                  style={styles.modalCloseButton}
                  onClick={handleDeleteCancel}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#f5f5f7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <p style={styles.modalMessage}>
                Are you sure you want to delete <strong>"{deleteConfirm.resumeTitle}"</strong>? This action cannot be undone.
              </p>
              <div style={styles.modalButtons}>
                <button
                  style={{
                    ...styles.modalButton,
                    ...styles.modalButtonCancel,
                  }}
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  onMouseEnter={(e) => {
                    if (!deleting) {
                      e.currentTarget.style.backgroundColor = isDark
                        ? "rgba(255,255,255,0.15)"
                        : "#e5e5e7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#f5f5f7";
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...styles.modalButton,
                    ...styles.modalButtonDelete,
                  }}
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  onMouseEnter={(e) => {
                    if (!deleting) {
                      e.currentTarget.style.backgroundColor = isDark
                        ? "rgba(244, 67, 54, 0.3)"
                        : "#ffcdd2";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(244, 67, 54, 0.2)"
                      : "#ffebee";
                  }}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeList;

