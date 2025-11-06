import React, { useState, useEffect } from "react";
import { LayoutGrid, FileDown, User2, Download } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Response = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { originalResume, editedResume, score, jobTitle, jobDescription } = location.state || {};

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
        return <h3 key={index} style={{ marginTop: "1rem", marginBottom: "0.5rem", fontWeight: "bold" }}>{trimmedLine.replace(/^#+\s/, "")}</h3>;
      }
      
      // Format bold text (**text**)
      const boldText = trimmedLine.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      return <p key={index} style={{ marginBottom: "0.5rem", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: boldText }} />;
    });
  };

  const handleDownload = () => {
    if (!editedResume) return;
    
    const blob = new Blob([editedResume], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_${jobTitle || "edited"}_${new Date().getTime()}.txt`;
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
    },
    activeNavItem: {
      color: "white",
      fontWeight: "600",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "2rem",
    },
    button: {
      padding: "0.75rem 2rem",
      backgroundColor: loading ? "#444" : "#000",
      color: "white",
      border: "2px solid white",
      borderRadius: "8px",
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
    },
    main: {
      flex: 1,
      padding: "2rem",
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "2rem",
      color: "#333",
    },
    textBox: {
      width: "80%",
      height: "70vh",
      padding: "1rem",
      fontSize: "1rem",
      fontFamily: "'Inter', sans-serif",
      lineHeight: "1.5",
      border: "1px solid #ccc",
      borderRadius: "8px",
      overflowY: "auto",
      whiteSpace: "pre-wrap",
      backgroundColor: "#fff",
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
          <Link to="/resume" style={styles.navItem}>
            <FileDown /> Resume
          </Link>
          <Link to="/profile" style={styles.navItem}>
            <User2 /> Profile
          </Link>
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
        <h1 style={styles.title}>Resume Analysis & Tailored Resume</h1>
        
        {score && score !== "N/A" && (
          <div style={{ 
            marginBottom: "1.5rem", 
            padding: "1rem", 
            backgroundColor: "#e8f5e9", 
            borderRadius: "8px",
            border: "2px solid #4caf50"
          }}>
            <h2 style={{ margin: 0, color: "#2e7d32", fontSize: "1.25rem" }}>
              Total Score: {score}/100
            </h2>
          </div>
        )}

        {jobTitle && (
          <div style={{ marginBottom: "1rem", color: "#666" }}>
            <strong>Job Title:</strong> {jobTitle}
          </div>
        )}

        {editedResume ? (
          <>
            <div style={{ ...styles.textBox, marginBottom: "1.5rem" }}>
              <h2 style={{ marginTop: 0, marginBottom: "1rem", color: "#333" }}>
                AI-Tailored Resume
              </h2>
              {processResumeText(editedResume)}
            </div>
            
            <div style={styles.buttonContainer}>
              <button
                style={{ ...styles.button, display: "flex", alignItems: "center", gap: "0.5rem" }}
                onClick={handleDownload}
              >
                <Download size={20} /> Download Resume
              </button>
            </div>
          </>
        ) : originalResume ? (
          <div style={styles.textBox}>
            <h2 style={{ marginTop: 0, marginBottom: "1rem", color: "#333" }}>
              Original Resume
            </h2>
            {processResumeText(originalResume)}
          </div>
        ) : (
          <p>No resume available.</p>
        )}
      </main>
    </div>
  );
};

export default Response;
