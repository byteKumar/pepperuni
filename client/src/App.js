import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import ResumeBuilder from "./components/ResumeBuilder";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Response from "./components/Response";
import JobDetails from "./components/JobDetails";
import ResumeUpload from "./components/ResumeUpload";
import ResumeList from "./components/ResumeList";
import Profile from "./components/Profile";
import "./App.css";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ResumeBuilder />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resumeupload" element={<ResumeUpload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/response" element={<Response />} />
          <Route path="/JD" element={<JobDetails />} />
          <Route path="/resume" element={<ResumeList />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
