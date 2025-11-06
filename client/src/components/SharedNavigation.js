import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, FileDown, User2, LogOut, Menu, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import "./SharedNavigation.css";

const SharedNavigation = ({ activePage = "home" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes("/resumeupload") || path === "/") return "home";
    if (path.includes("/resume")) return "resume";
    if (path.includes("/profile")) return "profile";
    return activePage;
  };

  const currentPage = getActivePage();

  const styles = useMemo(() => ({
    sidebar: {
      width: "30%",
      minWidth: "280px",
      maxWidth: "400px",
      height: "100vh",
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      color: isDark ? "var(--text-primary)" : "#1d1d1f",
      padding: "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRight: `2px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e5e7"}`,
      boxShadow: isDark ? "4px 0 24px rgba(0,0,0,0.5)" : "2px 0 12px rgba(0,0,0,0.08)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: "Inter, -apple-system, sans-serif",
      position: "fixed",
      left: 0,
      top: 0,
      overflowY: "auto",
      overflowX: "hidden",
      zIndex: 1000,
      background: isDark 
        ? "linear-gradient(180deg, var(--bg-secondary) 0%, rgba(0,0,0,0.3) 100%)"
        : "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
    },
    logo: {
      fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
      fontWeight: "800",
      marginBottom: "clamp(1.75rem, 3.5vw, 2.5rem)",
      color: isDark ? "#ffffff" : "#1d1d1f",
      letterSpacing: "-0.02em",
      lineHeight: "1.1",
      background: isDark 
        ? "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)"
        : "linear-gradient(135deg, #1d1d1f 0%, #4a4a4a 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      paddingBottom: "1rem",
      borderBottom: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      fontFamily: "Inter, -apple-system, sans-serif",
      transition: "background 0.3s ease, border-color 0.3s ease, -webkit-background-clip 0.3s ease, background-clip 0.3s ease",
      willChange: "background",
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      flex: "1 1 auto",
      minHeight: 0,
    },
    navItem: {
      display: "flex",
      alignItems: "center",
      gap: "clamp(0.75rem, 1.5vw, 1rem)",
      color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
      textDecoration: "none",
      fontSize: "clamp(0.8125rem, 1.375vw, 0.9375rem)",
      padding: "clamp(0.875rem, 1.75vw, 1.125rem) clamp(0.9375rem, 1.75vw, 1.375rem)",
      borderRadius: "16px",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontWeight: "600",
      letterSpacing: "-0.01em",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Inter, -apple-system, sans-serif",
    },
    activeNavItem: {
      color: isDark ? "#ffffff" : "#1d1d1f",
      backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "#f5f5f7",
      fontWeight: "700",
      boxShadow: isDark ? "0 4px 12px rgba(255,255,255,0.1)" : "0 4px 12px rgba(0,0,0,0.08)",
      transform: "translateX(4px)",
    },
    navItemHover: {
      backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#f5f5f7",
      color: isDark ? "#ffffff" : "#1d1d1f",
      transform: "translateX(4px)",
    },
    bottomSection: {
      display: "flex",
      flexDirection: "column",
      gap: "clamp(0.75rem, 1.5vw, 1rem)",
      marginTop: "auto",
      paddingTop: "clamp(1.5rem, 3vw, 2rem)",
      borderTop: `2px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e5e7"}`,
      flexShrink: 0,
    },
    logoutButton: {
      display: "flex",
      alignItems: "center",
      gap: "clamp(0.75rem, 1.5vw, 1rem)",
      padding: "clamp(0.875rem, 1.75vw, 1.125rem) clamp(0.9375rem, 1.75vw, 1.375rem)",
      borderRadius: "16px",
      cursor: "pointer",
      backgroundColor: "transparent",
      color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
      border: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      fontSize: "clamp(0.8125rem, 1.375vw, 0.9375rem)",
      fontWeight: "600",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      letterSpacing: "-0.01em",
      fontFamily: "Inter, -apple-system, sans-serif",
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
      padding: "2rem",
      maxWidth: "400px",
      width: "90%",
      boxShadow: isDark 
        ? "0 20px 60px rgba(0,0,0,0.5)" 
        : "0 20px 60px rgba(0,0,0,0.2)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      animation: "slideUp 0.3s ease",
    },
    modalTitle: {
      fontSize: "clamp(1.25rem, 2.75vw, 1.5rem)",
      fontWeight: "700",
      marginBottom: "1rem",
      color: isDark ? "#ffffff" : "#1d1d1f",
      letterSpacing: "-0.01em",
    },
    modalMessage: {
      fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
      color: isDark ? "rgba(255,255,255,0.8)" : "#86868b",
      marginBottom: "2rem",
      lineHeight: "1.6",
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
    },
    modalButtonCancel: {
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7",
      color: isDark ? "rgba(255,255,255,0.9)" : "#1d1d1f",
    },
    modalButtonConfirm: {
      backgroundColor: isDark ? "#ffffff" : "#1d1d1f",
      color: isDark ? "#1d1d1f" : "#ffffff",
    },
  }), [isDark]);

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 1001,
            padding: "0.75rem",
            borderRadius: "10px",
            border: "none",
            backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7",
            color: isDark ? "#ffffff" : "#1d1d1f",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.15)" : "#e8e8e8";
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside 
        style={{ 
          ...styles.sidebar, 
          ...(isMobile && !isMobileMenuOpen && { transform: "translateX(-100%)" }),
          ...(isMobile && isMobileMenuOpen && { zIndex: 1001 })
        }} 
        className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        <div>
          <div 
            key={`logo-${isDark}`} 
            style={{
              ...styles.logo,
              background: isDark 
                ? "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)"
                : "linear-gradient(135deg, #1d1d1f 0%, #4a4a4a 100%)",
            }}
          >
            PepperUni
          </div>
          <nav style={styles.nav}>
          <Link
            to="/resumeupload"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            style={{
              ...styles.navItem,
              ...(currentPage === "home" && styles.activeNavItem),
            }}
            onMouseEnter={(e) => {
              if (currentPage !== "home") {
                Object.assign(e.currentTarget.style, styles.navItemHover);
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== "home") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = isDark ? "var(--text-secondary)" : "var(--text-tertiary)";
              }
            }}
          >
            <LayoutGrid size={20} />
            Home
          </Link>
          <Link
            to="/resume"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            style={{
              ...styles.navItem,
              ...(currentPage === "resume" && styles.activeNavItem),
            }}
            onMouseEnter={(e) => {
              if (currentPage !== "resume") {
                Object.assign(e.currentTarget.style, styles.navItemHover);
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== "resume") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = isDark ? "var(--text-secondary)" : "var(--text-tertiary)";
              }
            }}
          >
            <FileDown size={20} />
            History
          </Link>
          <Link
            to="/profile"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            style={{
              ...styles.navItem,
              ...(currentPage === "profile" && styles.activeNavItem),
            }}
            onMouseEnter={(e) => {
              if (currentPage !== "profile") {
                Object.assign(e.currentTarget.style, styles.navItemHover);
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== "profile") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = isDark ? "var(--text-secondary)" : "var(--text-tertiary)";
              }
            }}
          >
            <User2 size={20} />
            Profile
          </Link>
        </nav>
        </div>
        <div style={styles.bottomSection}>
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "#f5f5f7";
            e.currentTarget.style.color = isDark ? "#ffffff" : "#1d1d1f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.7)" : "#86868b";
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
        </div>
      </div>
    </aside>
    {showLogoutConfirm && (
      <>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { 
                opacity: 0;
                transform: translateY(20px) scale(0.95);
              }
              to { 
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
        <div 
          style={styles.modalOverlay}
          onClick={cancelLogout}
        >
          <div 
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.modalTitle}>Confirm Logout</h2>
            <p style={styles.modalMessage}>
              Are you sure you want to log out?
            </p>
            <div style={styles.modalButtons}>
              <button
                style={{
                  ...styles.modalButton,
                  ...styles.modalButtonCancel,
                }}
                onClick={cancelLogout}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.15)" : "#e8e8e8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                No
              </button>
              <button
                style={{
                  ...styles.modalButton,
                  ...styles.modalButtonConfirm,
                }}
                onClick={confirmLogout}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow = isDark 
                    ? "0 6px 20px rgba(255,255,255,0.2)" 
                    : "0 6px 20px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default SharedNavigation;

