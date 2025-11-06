import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
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
            fontSize: "clamp(1.125rem, 2.5vw, 1.25rem)",
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
            fontSize: "clamp(0.9375rem, 2vw, 1rem)"
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
      fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
      fontWeight: "700",
      marginBottom: "1.5rem",
      color: isDark ? "#ffffff" : "#1d1d1f",
      letterSpacing: "-0.02em",
      lineHeight: "1.1",
    },
    scoreContainer: {
      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
      padding: "clamp(1.25rem, 3vw, 1.5rem) clamp(1.5rem, 3vw, 2rem)",
      backgroundColor: isDark ? "rgba(76, 175, 80, 0.15)" : "#e8f5e9",
      borderRadius: "18px",
      border: `1px solid ${isDark ? "rgba(76, 175, 80, 0.3)" : "#c8e6c9"}`,
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    },
    scoreTitle: {
      margin: 0,
      color: isDark ? "#81c784" : "#2e7d32",
      fontSize: "clamp(1.25rem, 3vw, 1.375rem)",
      fontWeight: "600",
      letterSpacing: "-0.01em",
    },
    jobTitleInfo: {
      marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
      padding: "clamp(1rem, 2.5vw, 1.25rem) clamp(1.5rem, 3vw, 1.75rem)",
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      borderRadius: "14px",
      border: `1px solid ${isDark ? "var(--border-color)" : "#e5e5e7"}`,
      color: isDark ? "var(--text-primary)" : "#1d1d1f",
      fontSize: "clamp(0.9375rem, 2vw, 1rem)",
      fontWeight: "500",
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
    },
    textBox: {
      width: "100%",
      minHeight: "clamp(400px, 60vh, 600px)",
      padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 3rem)",
      fontSize: "clamp(0.9375rem, 2vw, 1rem)",
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
      fontSize: "clamp(1.375rem, 3vw, 1.625rem)",
      fontWeight: "700",
      letterSpacing: "-0.01em",
      borderBottom: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      paddingBottom: "1rem",
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
      fontSize: "clamp(0.9375rem, 2vw, 1rem)",
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
      gap: "0.75rem",
      marginBottom: "2rem",
      borderBottom: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      paddingBottom: "0.5rem",
    },
    tab: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "transparent",
      color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
      border: "none",
      borderRadius: "8px 8px 0 0",
      cursor: "pointer",
      fontSize: "clamp(0.9375rem, 2vw, 1rem)",
      fontWeight: "500",
      transition: "all 0.2s ease",
      borderBottom: "2px solid transparent",
      marginBottom: "-2px",
    },
    tabActive: {
      color: isDark ? "#ffffff" : "#1d1d1f",
      fontWeight: "600",
      borderBottomColor: isDark ? "#ffffff" : "#1d1d1f",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
    },
  };

  return (
    <div style={styles.container}>
      <SharedNavigation activePage="home" />
      <main style={styles.main}>
        <h1 style={styles.title}>Resume Analysis & Tailored Resume</h1>
        
        {score && score !== "N/A" && (
          <div style={styles.scoreContainer}>
            <h2 style={styles.scoreTitle}>
              Total Score: {score}/100
            </h2>
          </div>
        )}

        {jobTitle && (
          <div style={styles.jobTitleInfo}>
            <strong style={{ color: isDark ? "#ffffff" : "#1d1d1f", fontWeight: "600" }}>Job Title:</strong> {jobTitle}
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
              >
                AI-Tailored Resume
              </button>
              {originalResume && (
                <button
                  style={{
                    ...styles.tab,
                    ...(viewMode === "original" && styles.tabActive),
                  }}
                  onClick={() => setViewMode("original")}
                >
                  Original Resume
                </button>
              )}
            </div>

            <div style={styles.textBox}>
              <h2 style={styles.sectionTitle}>
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
