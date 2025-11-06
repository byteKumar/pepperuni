import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LayoutGrid, FileDown, User2, Settings, Download, Calendar, TrendingUp } from "lucide-react";
import axios from "axios";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!token || !user.id) {
      navigate("/login");
      return;
    }

    // Fetch user resumes
    fetchResumes(user.id, token);
  }, [navigate]);

  const fetchResumes = async (userId, token) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:5001/api/resumes/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setResumes(response.data.data.resumes || []);
      } else {
        setError(response.data.message || "Failed to fetch resumes");
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError(err.response?.data?.message || "An error occurred while fetching resumes");
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

  const handleViewResume = (resumeData) => {
    navigate("/response", {
      state: {
        editedResume: resumeData.resume,
        score: resumeData.score,
        jobTitle: resumeData.job_title,
        originalResume: null,
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
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "1rem",
      color: "#333",
    },
    subtitle: {
      fontSize: "1rem",
      color: "#666",
      marginBottom: "2rem",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
    },
    errorContainer: {
      padding: "1rem",
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      color: "#666",
    },
    resumeGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "1.5rem",
    },
    resumeCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      border: "1px solid #e0e0e0",
    },
    resumeCardHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
    resumeHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1rem",
    },
    resumeTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#333",
      margin: 0,
      flex: 1,
    },
    scoreBadge: {
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      color: "white",
      fontWeight: "600",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },
    resumeMeta: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#666",
      fontSize: "0.875rem",
    },
    resumePreview: {
      color: "#666",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      maxHeight: "100px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginBottom: "1rem",
    },
    resumeActions: {
      display: "flex",
      gap: "0.5rem",
      justifyContent: "flex-end",
    },
    actionButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "#000",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "background-color 0.2s",
    },
    actionButtonHover: {
      backgroundColor: "#333",
    },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>PepperUni</div>
        <nav style={styles.nav}>
          <Link to="/resumeupload" style={styles.navItem}>
            <LayoutGrid /> Home
          </Link>
          <div style={{ ...styles.navItem, ...styles.activeNavItem }}>
            <FileDown /> Resume
          </div>
          <div style={styles.navItem}>
            <User2 /> Profile
          </div>
          <div style={styles.navItem}>
            <Settings /> Settings
          </div>
          <div
            style={styles.navItem}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </div>
        </nav>
      </aside>
      <main style={styles.main}>
        <h1 style={styles.title}>My Resumes</h1>
        <p style={styles.subtitle}>
          View all your tailored resumes, scores, and history
        </p>

        {loading ? (
          <div style={styles.loadingContainer}>
            <p style={{ color: "#666", fontSize: "1.125rem" }}>Loading resumes...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <strong>Error:</strong> {error}
          </div>
        ) : resumes.length === 0 ? (
          <div style={styles.emptyState}>
            <FileDown size={64} style={{ marginBottom: "1rem", color: "#ccc" }} />
            <h2 style={{ color: "#666", marginBottom: "0.5rem" }}>
              No resumes yet
            </h2>
            <p style={{ color: "#999", marginBottom: "1.5rem" }}>
              Start by uploading and tailoring your first resume!
            </p>
            <Link
              to="/resumeupload"
              style={{
                ...styles.actionButton,
                textDecoration: "none",
                display: "inline-flex",
              }}
            >
              Upload Resume
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1rem", color: "#666" }}>
              Total Resumes: <strong>{resumes.length}</strong>
            </div>
            <div style={styles.resumeGrid}>
              {resumes.map((resume, index) => (
                <div
                  key={resume._id || index}
                  style={styles.resumeCard}
                  onClick={() => handleViewResume(resume)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={styles.resumeHeader}>
                    <h3 style={styles.resumeTitle}>
                      {resume.job_title || "Untitled Resume"}
                    </h3>
                    {resume.score && resume.score !== "N/A" && (
                      <div
                        style={{
                          ...styles.scoreBadge,
                          backgroundColor: getScoreColor(resume.score),
                        }}
                      >
                        <TrendingUp size={16} />
                        {resume.score}/100
                      </div>
                    )}
                  </div>

                  <div style={styles.resumeMeta}>
                    <div style={styles.metaItem}>
                      <Calendar size={16} />
                      {formatDate(resume.created_date)}
                    </div>
                    {resume.filename && (
                      <div style={styles.metaItem}>
                        <FileDown size={16} />
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
                        e.currentTarget.style.backgroundColor = "#333";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#000";
                      }}
                    >
                      <Download size={16} />
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

