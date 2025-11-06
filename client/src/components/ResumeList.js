import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Calendar, TrendingUp, FileText } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import SharedNavigation from "./SharedNavigation";
import axios from "axios";
import API_BASE_URL from "../config/api";

const ResumeList = () => {
  const { isDark } = useTheme();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      marginBottom: "0.5rem",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      letterSpacing: "-0.5px",
    },
    subtitle: {
      fontSize: "clamp(0.9375rem, 2.25vw, 1rem)",
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
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
      fontSize: "clamp(1rem, 2.25vw, 1.125rem)",
      fontWeight: "600",
      color: isDark ? "var(--text-primary)" : "var(--text-primary)",
      margin: 0,
      flex: 1,
      lineHeight: "1.4",
    },
    scoreBadge: {
      padding: "clamp(0.5rem, 1.5vw, 0.625rem) clamp(1rem, 2vw, 1.25rem)",
      borderRadius: "24px",
      color: "white",
      fontWeight: "600",
      fontSize: "clamp(0.75rem, 1.375vw, 0.8125rem)",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
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
      fontSize: "0.8125rem",
    },
    resumePreview: {
      color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)",
      fontSize: "0.8125rem",
      lineHeight: "1.6",
      maxHeight: "120px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginBottom: "1.25rem",
    },
    resumeActions: {
      display: "flex",
      gap: "0.75rem",
      justifyContent: "flex-end",
    },
    actionButton: {
      padding: "clamp(0.625rem, 1.5vw, 0.75rem) clamp(1.25rem, 2vw, 1.5rem)",
      backgroundColor: isDark ? "#ffffff" : "#000000",
      color: isDark ? "#1d1d1f" : "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "clamp(0.75rem, 1.375vw, 0.8125rem)",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    actionButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
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
            <p style={{ color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)", fontSize: "1rem" }}>
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
            <h2 style={{ color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)", marginBottom: "0.75rem", fontSize: "1.375rem" }}>
              No resumes yet
            </h2>
            <p style={{ color: isDark ? "var(--text-tertiary)" : "#999", marginBottom: "2rem", fontSize: "0.9375rem" }}>
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
            <div style={{ marginBottom: "1.5rem", color: isDark ? "var(--text-secondary)" : "var(--text-tertiary)", fontSize: "0.9375rem" }}>
              Total Resumes: <strong style={{ color: isDark ? "var(--text-primary)" : "var(--text-primary)" }}>{resumes.length}</strong>
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
    </div>
  );
};

export default ResumeList;

