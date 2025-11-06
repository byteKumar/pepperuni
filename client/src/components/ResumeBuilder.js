import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowRight } from "lucide-react";

const ResumeBuilder = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: isDark ? "#000000" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Roboto', sans-serif",
      overflowX: "visible",
      overflowY: "hidden",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "clamp(0.75rem, 1.5vw, 1rem) clamp(1.25rem, 3vw, 2rem)",
      flexShrink: 0,
      position: "relative",
      zIndex: 10,
    },
    logo: {
      fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
      fontWeight: "700",
      letterSpacing: "-0.02em",
      color: isDark ? "#ffffff" : "#000000",
    },
    authButtons: {
      display: "flex",
      gap: "clamp(0.75rem, 2vw, 1rem)",
      alignItems: "center",
    },
    authButton: {
      padding: "clamp(0.625rem, 1.5vw, 0.75rem) clamp(1.25rem, 3vw, 1.75rem)",
      borderRadius: "8px",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`,
      backgroundColor: "transparent",
      color: isDark ? "#ffffff" : "#000000",
      fontSize: "clamp(0.8125rem, 1.75vw, 0.9375rem)",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: "inherit",
      letterSpacing: "-0.01em",
    },
    authButtonPrimary: {
      backgroundColor: isDark ? "#ffffff" : "#000000",
      color: isDark ? "#000000" : "#ffffff",
      border: "none",
    },
    mainContent: {
      display: "grid",
      gridTemplateColumns: "1fr 1.1fr",
      flex: 1,
      alignItems: "center",
      gap: "clamp(1.25rem, 3vw, 2rem)",
      padding: "clamp(1rem, 2.5vw, 1.5rem) clamp(1.25rem, 3vw, 2rem)",
      maxWidth: "1400px",
      margin: "0 auto",
      width: "100%",
      minHeight: 0,
      overflow: "visible",
    },
    leftSection: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "clamp(0.75rem, 1.5vw, 1rem)",
      animation: "fadeInLeft 0.8s ease-out",
      minHeight: 0,
    },
    badge: {
      display: "inline-block",
      padding: "clamp(0.375rem, 1vw, 0.5rem) clamp(0.75rem, 1.5vw, 1rem)",
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      borderRadius: "20px",
      fontSize: "clamp(0.6875rem, 1.5vw, 0.75rem)",
      fontWeight: "600",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      width: "fit-content",
      color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
    },
    headline: {
      fontSize: "clamp(2rem, 5vw, 3rem)",
      fontWeight: "700",
      lineHeight: "1.1",
      letterSpacing: "-0.03em",
      margin: 0,
      color: isDark ? "#ffffff" : "#000000",
    },
    subheadline: {
      fontSize: "clamp(1rem, 2vw, 1.25rem)",
      fontWeight: "600",
      lineHeight: "1.3",
      letterSpacing: "-0.01em",
      margin: 0,
      color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
    },
    description: {
      fontSize: "clamp(0.875rem, 1.75vw, 1rem)",
      lineHeight: "1.6",
      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
      margin: 0,
      maxWidth: "600px",
    },
    featuresList: {
      display: "flex",
      flexDirection: "column",
      gap: "clamp(0.5rem, 1vw, 0.75rem)",
      marginTop: "clamp(0.25rem, 0.5vw, 0.5rem)",
    },
    featureItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "clamp(0.5rem, 1.25vw, 0.75rem)",
      fontSize: "clamp(0.8125rem, 1.75vw, 0.9375rem)",
      lineHeight: "1.5",
      color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
    },
    featureBullet: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: isDark ? "#ffffff" : "#000000",
      marginTop: "0.5em",
      flexShrink: 0,
    },
    ctaButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "clamp(0.5rem, 1.25vw, 0.75rem)",
      padding: "clamp(0.875rem, 2vw, 1rem) clamp(1.75rem, 3.5vw, 2.25rem)",
      backgroundColor: isDark ? "#ffffff" : "#000000",
      color: isDark ? "#000000" : "#ffffff",
      borderRadius: "10px",
      fontSize: "clamp(0.9375rem, 2vw, 1rem)",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: "inherit",
      letterSpacing: "-0.01em",
      marginTop: "clamp(0.25rem, 0.5vw, 0.5rem)",
      boxShadow: isDark 
        ? "0 4px 20px rgba(255,255,255,0.15)" 
        : "0 4px 20px rgba(0,0,0,0.15)",
      width: "fit-content",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      animation: "fadeInRight 0.8s ease-out",
      minHeight: 0,
      overflow: "visible",
      position: "relative",
    },
    imageContainer: {
      width: "100%",
      maxWidth: "none",
      maxHeight: "calc(100vh - 80px)",
      borderRadius: "10px",
      overflow: "visible",
      boxShadow: isDark 
        ? "0 20px 60px rgba(255,255,255,0.1)" 
        : "0 20px 60px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      position: "relative",
    },
    image: {
      width: "125%",
      height: "auto",
      maxHeight: "calc(100vh - 80px)",
      display: "block",
      objectFit: "contain",
      transform: "scale(1.3)",
      transformOrigin: "left center",
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @media (max-width: 968px) {
            .main-content {
              grid-template-columns: 1fr !important;
            }
            .right-section {
              order: -1;
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logo}>PepperUni</div>
          <div style={styles.authButtons}>
            <button
              style={styles.authButton}
              onClick={() => navigate("/login")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark 
                  ? "rgba(255,255,255,0.1)" 
                  : "rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Login
            </button>
            <button
              style={{ ...styles.authButton, ...styles.authButtonPrimary }}
              onClick={() => navigate("/signup")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = isDark 
                  ? "0 6px 24px rgba(255,255,255,0.2)" 
                  : "0 6px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Sign Up
            </button>
          </div>
        </header>

        <div className="main-content" style={styles.mainContent}>
          <div style={styles.leftSection}>
            <div style={styles.badge}>Instant Resume Score</div>
            <h1 style={styles.headline}>
              Get Your Resume<br />
              <span style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)" }}>
                Job-Ready in Minutes
              </span>
            </h1>
            <p style={styles.subheadline}>
              Actionable fixes. Real results. Higher interview rates.
            </p>
            <p style={styles.description}>
              Upload your resume and job description—get an instant, role-specific score with tailored recommendations. Our AI benchmarks your resume against the job description, flags gaps, aligns keywords for ATS systems, and suggests impact-driven phrasing.
            </p>
            <div style={styles.featuresList}>
              <div style={styles.featureItem}>
                <div style={styles.featureBullet}></div>
                <span>See your top quick wins and a prioritized checklist</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureBullet}></div>
                <span>Boost your interview odds in minutes, not hours</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureBullet}></div>
                <span>Get role-specific insights tailored to each application</span>
              </div>
            </div>
            <button
              style={styles.ctaButton}
              onClick={() => navigate("/signup")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = isDark 
                  ? "0 8px 30px rgba(255,255,255,0.2)" 
                  : "0 8px 30px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = isDark 
                  ? "0 4px 20px rgba(255,255,255,0.15)" 
                  : "0 4px 20px rgba(0,0,0,0.15)";
              }}
            >
              Get My Free Score
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="right-section" style={styles.rightSection}>
            <div style={styles.imageContainer}>
              <img 
                src="/frontPage.png" 
                alt="Resume Analysis Dashboard" 
                style={styles.image}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;
