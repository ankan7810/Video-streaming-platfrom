import React, { useState } from "react";
import "./App.css";

import Navbar from "./Global-Component/Navbar.jsx";
import SideBar from "./Global-Component/SideBar.jsx";
import FilterBar from "./Global-Component/FilterBar.jsx";
import Video from "./Component/Video.jsx";

import Login from "./Auth/Login.jsx";
import Signup from "./Auth/Signup.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";
import ResetPassword from "./Auth/ResetPassword.jsx";

function App() {

  const [isOpen, setIsOpen] = useState(true);

  const [authMode, setAuthMode] = useState(null);

  // ✅ use localStorage instead of /me route
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  // ✅ detect reset password page
  const isResetPasswordPage =
    window.location.pathname === "/reset-password";


  // ✅ handle login success
  const handleLoginSuccess = () => {

    localStorage.setItem("isAuthenticated", "true");

    setIsAuthenticated(true);

  };


  // ✅ handle logout
  const handleLogout = () => {

    localStorage.removeItem("isAuthenticated");

    setIsAuthenticated(false);

  };


  // ✅ show reset password page only
  if (isResetPasswordPage) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ResetPassword />
      </div>
    );

  }


  return (

    <div className="min-h-screen">

      {/* Navbar */}
      <Navbar
        toggleSidebar={() => setIsOpen(!isOpen)}
        openAuth={(mode) => setAuthMode(mode)}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={handleLogout}
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
              setIsAuthenticated={handleLoginSuccess}
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