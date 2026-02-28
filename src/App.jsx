import React, { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./Global-Component/Navbar.jsx";
import SideBar from "./Global-Component/SideBar.jsx";
import FilterBar from "./Global-Component/FilterBar.jsx";
import Video from "./Component/Video.jsx";
import Login from "./Auth/Login.jsx";
import Signup from "./Auth/Signup.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [authMode, setAuthMode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔥 Check login status when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <Navbar
        toggleSidebar={() => setIsOpen(!isOpen)}
        openAuth={(mode) => setAuthMode(mode)}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      {/* Sidebar */}
      {isOpen && <SideBar />}

      {/* Main Content */}
      <div
        className={`pt-14 transition-all duration-300 ${
          isOpen ? "ml-60" : "ml-16"
        }`}
      >
        <FilterBar isOpen={isOpen} />
        <Video />
      </div>

      {/* AUTH MODAL */}
      {authMode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          {authMode === "login" && (
            <Login
              switchToSignup={() => setAuthMode("signup")}
              switchToForgot={() => setAuthMode("forgot")}
              closeModal={() => setAuthMode(null)}
              setIsAuthenticated={setIsAuthenticated}  // 🔥 THIS WAS MISSING
            />
          )}

          {authMode === "signup" && (
            <Signup
              switchToLogin={() => setAuthMode("login")}
              closeModal={() => setAuthMode(null)}
            />
          )}

          {authMode === "forgot" && (
            <ForgotPassword
              switchToLogin={() => setAuthMode("login")}
              closeModal={() => setAuthMode(null)}
            />
          )}

        </div>
      )}

    </div>
  );
}

export default App;