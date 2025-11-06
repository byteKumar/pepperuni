import React, { useState, useEffect } from "react";
import { Download, Briefcase, Sparkles, Award, FileText } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import SharedNavigation from "./SharedNavigation";

const Response = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { originalResume, editedResume, score, jobTitle, jobDescription, viewMode: initialViewMode } = location.state || {};
  const [viewMode, setViewMode] = useState(initialViewMode || "edited");

  useEffect(() => {
    // Redirect if no data
    if (!editedResume && !originalResume) {
      navigate("/resumeupload");
    }
  }, [editedResume, originalResume, navigate]);

  // Function to process the resume text for display
  const processResumeText = (text) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine === "") return <br key={index} />;
      
      // Format headers (lines that are all caps or start with #)
      if (trimmedLine.match(/^#{1,6}\s/) || trimmedLine.match(/^[A-Z\s]{3,}$/)) {
        return (
          <h3 
            key={index} 
            style={{ 
            marginTop: "2rem", 
            marginBottom: "1rem", 
            fontWeight: "700", 
            color: isDark ? "#ffffff" : "#1d1d1f",
            fontSize: "clamp(1rem, 2.25vw, 1.125rem)",
            letterSpacing: "-0.01em",
            lineHeight: "1.4"
          }}
          >
            {trimmedLine.replace(/^#+\s/, "")}
          </h3>
        );
      }
      
      // Format bold text (**text**)
      const boldText = trimmedLine.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 600; color: ' + (isDark ? '#ffffff' : '#1d1d1f') + '">$1</strong>');
      
      return (
        <p 
          key={index} 
          style={{ 
            marginBottom: "1rem", 
            lineHeight: "1.75", 
            color: isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f",
            fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)"
          }} 
          dangerouslySetInnerHTML={{ __html: boldText }} 
        />
      );
    });
  };

  const handleDownload = () => {
    const resumeToDownload = viewMode === "original" ? originalResume : editedResume;
    const resumeType = viewMode === "original" ? "original" : "tailored";
    
    if (!resumeToDownload) return;
    
    const blob = new Blob([resumeToDownload], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_${resumeType}_${jobTitle || "resume"}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
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
      marginBottom: "1.5rem",
      color: isDark ? "#ffffff" : "#1d1d1f",
      letterSpacing: "-0.02em",
      lineHeight: "1.1",
    },
    scoreContainer: {
      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
      padding: "clamp(1.5rem, 3vw, 2rem) clamp(1.75rem, 4vw, 2.5rem)",
      background: isDark 
        ? "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(56, 142, 60, 0.15) 100%)" 
        : "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      borderRadius: "20px",
      border: `2px solid ${isDark ? "rgba(76, 175, 80, 0.4)" : "#81c784"}`,
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      boxShadow: isDark 
        ? "0 8px 32px rgba(76, 175, 80, 0.2), 0 4px 16px rgba(0,0,0,0.3)" 
        : "0 4px 20px rgba(76, 175, 80, 0.15), 0 2px 8px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    scoreIcon: {
      flexShrink: 0,
      padding: "0.75rem",
      borderRadius: "12px",
      backgroundColor: isDark ? "rgba(76, 175, 80, 0.3)" : "#4caf50",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: isDark ? "0 4px 12px rgba(76, 175, 80, 0.3)" : "0 2px 8px rgba(76, 175, 80, 0.2)",
    },
    scoreContent: {
      flex: 1,
    },
    scoreLabel: {
      margin: 0,
      color: isDark ? "rgba(255,255,255,0.8)" : "#2e7d32",
      fontSize: "clamp(0.8125rem, 1.75vw, 0.9375rem)",
      fontWeight: "500",
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      marginBottom: "0.5rem",
    },
    scoreTitle: {
      margin: 0,
      color: isDark ? "#81c784" : "#1b5e20",
      fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
      fontWeight: "700",
      letterSpacing: "-0.02em",
      display: "flex",
      alignItems: "baseline",
      gap: "0.5rem",
    },
    scoreValue: {
      fontSize: "clamp(2.25rem, 5.5vw, 3.125rem)",
      fontWeight: "800",
      background: isDark 
        ? "linear-gradient(135deg, #81c784 0%, #66bb6a 100%)" 
        : "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    jobTitleInfo: {
      marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
      padding: "clamp(1.25rem, 3vw, 1.5rem) clamp(1.5rem, 3vw, 2rem)",
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      borderRadius: "16px",
      border: `1px solid ${isDark ? "var(--border-color)" : "#e5e5e7"}`,
      color: isDark ? "var(--text-primary)" : "#1d1d1f",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      fontWeight: "500",
      boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    jobTitleIcon: {
      flexShrink: 0,
      padding: "0.625rem",
      borderRadius: "10px",
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f",
    },
    jobTitleText: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    jobTitleLabel: {
      fontSize: "clamp(0.6875rem, 1.375vw, 0.8125rem)",
      fontWeight: "600",
      color: isDark ? "rgba(255,255,255,0.6)" : "#86868b",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    jobTitleValue: {
      fontSize: "clamp(0.9375rem, 2.25vw, 1rem)",
      fontWeight: "600",
      color: isDark ? "#ffffff" : "#1d1d1f",
    },
    textBox: {
      width: "100%",
      minHeight: "clamp(400px, 60vh, 600px)",
      padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 3rem)",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', 'Roboto', sans-serif",
      lineHeight: "1.75",
      border: `1px solid ${isDark ? "var(--border-color)" : "#e5e5e7"}`,
      borderRadius: "18px",
      overflowY: "auto",
      whiteSpace: "pre-wrap",
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      color: isDark ? "var(--text-primary)" : "#1d1d1f",
      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
      marginBottom: "2rem",
    },
    sectionTitle: {
      marginTop: 0,
      marginBottom: "2rem",
      color: isDark ? "#ffffff" : "#1d1d1f",
      fontSize: "clamp(1.25rem, 2.75vw, 1.5rem)",
      fontWeight: "700",
      letterSpacing: "-0.01em",
      borderBottom: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      paddingBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    sectionIcon: {
      flexShrink: 0,
      padding: "0.5rem",
      borderRadius: "8px",
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7",
      color: isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "3rem",
    },
    button: {
      padding: "clamp(0.875rem, 2vw, 1rem) clamp(2rem, 4vw, 2.5rem)",
      backgroundColor: isDark ? "#ffffff" : "#1d1d1f",
      color: isDark ? "#1d1d1f" : "#ffffff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: isDark ? "0 4px 16px rgba(255,255,255,0.1)" : "0 4px 16px rgba(0,0,0,0.15)",
      letterSpacing: "-0.01em",
    },
    buttonHover: {
      transform: "translateY(-2px) scale(1.02)",
      boxShadow: isDark ? "0 6px 24px rgba(255,255,255,0.15)" : "0 6px 24px rgba(0,0,0,0.2)",
    },
    tabsContainer: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "2rem",
      padding: "0.5rem",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f7",
      borderRadius: "14px",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
    },
    tab: {
      padding: "clamp(0.75rem, 2vw, 0.875rem) clamp(1.25rem, 3vw, 1.75rem)",
      backgroundColor: "transparent",
      color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      fontWeight: "500",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    tabActive: {
      color: isDark ? "#ffffff" : "#1d1d1f",
      fontWeight: "600",
      backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "#ffffff",
      boxShadow: isDark 
        ? "0 2px 8px rgba(0,0,0,0.2)" 
        : "0 2px 8px rgba(0,0,0,0.08)",
      transform: "translateY(-1px)",
    },
  };

  return (
    <div style={styles.container}>
      <SharedNavigation activePage="home" />
      <main style={styles.main}>
        <h1 style={styles.title}>Resume Analysis & Tailored Resume</h1>
        
        {score && score !== "N/A" && (
          <div style={styles.scoreContainer}>
            <div style={styles.scoreIcon}>
              <Award size={32} color={isDark ? "#81c784" : "#ffffff"} />
            </div>
            <div style={styles.scoreContent}>
              <p style={styles.scoreLabel}>Total Score</p>
            <h2 style={styles.scoreTitle}>
                <span style={styles.scoreValue}>{score}</span>
                <span style={{ fontSize: "clamp(1.375rem, 3.5vw, 1.875rem)", opacity: 0.7 }}>/100</span>
            </h2>
            </div>
          </div>
        )}

        {jobTitle && (
          <div style={styles.jobTitleInfo}>
            <div style={styles.jobTitleIcon}>
              <Briefcase size={20} />
            </div>
            <div style={styles.jobTitleText}>
              <span style={styles.jobTitleLabel}>Job Title</span>
              <span style={styles.jobTitleValue}>{jobTitle}</span>
            </div>
          </div>
        )}

        {editedResume ? (
          <>
            <div style={styles.tabsContainer}>
              <button
                style={{
                  ...styles.tab,
                  ...(viewMode !== "original" && styles.tabActive),
                }}
                onClick={() => setViewMode("edited")}
                onMouseEnter={(e) => {
                  if (viewMode === "original") {
                    e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "#e8e8e8";
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f";
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode === "original") {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.7)" : "#86868b";
                  }
                }}
              >
                <Sparkles size={18} />
                AI-Tailored Resume
              </button>
              {originalResume && (
                <button
                  style={{
                    ...styles.tab,
                    ...(viewMode === "original" && styles.tabActive),
                  }}
                  onClick={() => setViewMode("original")}
                  onMouseEnter={(e) => {
                    if (viewMode !== "original") {
                      e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "#e8e8e8";
                      e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== "original") {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.7)" : "#86868b";
                    }
                  }}
                >
                  <FileText size={18} />
                  Original Resume
                </button>
              )}
            </div>

            <div style={styles.textBox}>
              <h2 style={styles.sectionTitle}>
                <div style={styles.sectionIcon}>
                  {viewMode === "original" ? <FileText size={24} /> : <Sparkles size={24} />}
                </div>
                {viewMode === "original" ? "Original Resume" : "AI-Tailored Resume"}
              </h2>
              {processResumeText(viewMode === "original" ? originalResume : editedResume)}
            </div>
            
            <div style={styles.buttonContainer}>
              <button
                style={styles.button}
                onClick={handleDownload}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.buttonHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark ? "0 4px 16px rgba(255,255,255,0.1)" : "0 4px 16px rgba(0,0,0,0.15)";
                }}
              >
                <Download size={20} /> Download {viewMode === "original" ? "Original" : "Tailored"} Resume
              </button>
            </div>
          </>
        ) : originalResume ? (
          <div style={styles.textBox}>
            <h2 style={styles.sectionTitle}>
              <div style={styles.sectionIcon}>
                <FileText size={24} />
              </div>
              Original Resume
            </h2>
            {processResumeText(originalResume)}
          </div>
        ) : (
          <p style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#86868b", fontSize: "clamp(0.9375rem, 2vw, 1rem)" }}>No resume available.</p>
        )}
      </main>
    </div>
  );
};

export default Response;
