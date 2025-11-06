import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const FloatingThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const buttonRef = useRef(null);

  // Load saved position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("themeTogglePosition");
    if (savedPosition) {
      try {
        const { x, y } = JSON.parse(savedPosition);
        setPosition({ x, y });
      } catch (e) {
        console.error("Error loading theme toggle position:", e);
      }
    } else {
      // Default position: bottom right
      setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    }
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem("themeTogglePosition", JSON.stringify(position));
    }
  }, [position]);

  // Handle window resize to keep button within bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 60),
        y: Math.min(prev.y, window.innerHeight - 60),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only handle left mouse button
    
    setIsDragging(true);
    setHasMoved(false);
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
    e.preventDefault();
  };

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setHasMoved(true);
      let newX = e.clientX - dragOffset.x - 30; // 30 is half of button width (60px)
      let newY = e.clientY - dragOffset.y - 30; // 30 is half of button height (60px)

      // Keep button within viewport bounds
      newX = Math.max(0, Math.min(newX, window.innerWidth - 60));
      newY = Math.max(0, Math.min(newY, window.innerHeight - 60));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Reset hasMoved after a short delay to allow click handler to check it
      setTimeout(() => setHasMoved(false), 100);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none"; // Prevent text selection while dragging

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging, dragOffset]);

  const handleClick = (e) => {
    // Only toggle theme if we didn't drag (just clicked)
    if (!hasMoved && !isDragging) {
      toggleTheme();
    }
  };

  const styles = {
    container: {
      position: "fixed",
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(29,29,31,0.1)",
      border: `2px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(29,29,31,0.2)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: isDragging ? "grabbing" : "grab",
      zIndex: 9999,
      boxShadow: isDark
        ? "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
        : "0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(29,29,31,0.1)",
      transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },
    button: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      background: "transparent",
      cursor: isDragging ? "grabbing" : "grab",
      color: isDark ? "#ffffff" : "#1d1d1f",
      transition: "transform 0.2s ease, color 0.3s ease",
      outline: "none",
    },
    icon: {
      transition: "transform 0.3s ease, opacity 0.3s ease",
    },
  };

  return (
    <div
      ref={buttonRef}
      style={styles.container}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = isDark
            ? "rgba(255,255,255,0.2)"
            : "rgba(29,29,31,0.15)";
          e.currentTarget.style.boxShadow = isDark
            ? "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15)"
            : "0 12px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(29,29,31,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = isDark
            ? "rgba(255,255,255,0.15)"
            : "rgba(29,29,31,0.1)";
          e.currentTarget.style.boxShadow = isDark
            ? "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(29,29,31,0.1)";
        }
      }}
    >
      <button
        type="button"
        style={styles.button}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun size={28} style={styles.icon} />
        ) : (
          <Moon size={28} style={styles.icon} />
        )}
      </button>
    </div>
  );
};

export default FloatingThemeToggle;

