import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, FileDown, User2, Moon, Sun, LogOut, Menu, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import "./SharedNavigation.css";

const SharedNavigation = ({ activePage = "home" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes("/resumeupload") || path === "/") return "home";
    if (path.includes("/resume")) return "resume";
    if (path.includes("/profile")) return "profile";
    return activePage;
  };

  const currentPage = getActivePage();

  const styles = {
    sidebar: {
      width: "280px",
      height: "100vh",
      backgroundColor: isDark ? "var(--bg-secondary)" : "#ffffff",
      color: isDark ? "var(--text-primary)" : "#1d1d1f",
      padding: "2.5rem 2rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      boxShadow: isDark ? "2px 0 12px rgba(0,0,0,0.4)" : "1px 0 4px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      position: "fixed",
      left: 0,
      top: 0,
      overflowY: "auto",
      overflowX: "hidden",
      zIndex: 1000,
    },
    logo: {
      fontSize: "1.625rem",
      fontWeight: "700",
      marginBottom: "3rem",
      color: isDark ? "#ffffff" : "#1d1d1f",
      letterSpacing: "-0.02em",
      lineHeight: "1.1",
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
      gap: "0.75rem",
      color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
      textDecoration: "none",
      fontSize: "0.9375rem",
      padding: "0.875rem 1rem",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      fontWeight: "500",
      letterSpacing: "-0.01em",
    },
    activeNavItem: {
      color: isDark ? "#ffffff" : "#1d1d1f",
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7",
      fontWeight: "600",
    },
    navItemHover: {
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f5f5f7",
      color: isDark ? "#ffffff" : "#1d1d1f",
    },
    bottomSection: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      marginTop: "auto",
      paddingTop: "2rem",
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e5e7"}`,
      flexShrink: 0,
    },
    themeToggle: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.875rem 1rem",
      borderRadius: "12px",
      cursor: "pointer",
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7",
      color: isDark ? "#ffffff" : "#1d1d1f",
      border: "none",
      fontSize: "0.9375rem",
      fontWeight: "500",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      marginBottom: "0.75rem",
      letterSpacing: "-0.01em",
    },
    logoutButton: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.875rem 1rem",
      borderRadius: "12px",
      cursor: "pointer",
      backgroundColor: "transparent",
      color: isDark ? "rgba(255,255,255,0.7)" : "#86868b",
      border: "none",
      fontSize: "0.9375rem",
      fontWeight: "500",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      letterSpacing: "-0.01em",
    },
  };

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
          <div style={styles.logo}>PepperUni</div>
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
            Resume
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
          style={styles.themeToggle}
          onClick={toggleTheme}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.15)" : "#e8e8e8";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.1)" : "#f5f5f7";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
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
    </>
  );
};

export default SharedNavigation;

