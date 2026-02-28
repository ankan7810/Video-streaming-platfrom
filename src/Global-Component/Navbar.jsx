import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = ({
  toggleSidebar,
  openAuth,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      setIsAuthenticated(false);
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 h-14 bg-black text-white fixed top-0 left-0 right-0 z-50">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        <MenuIcon className="cursor-pointer" onClick={toggleSidebar} />

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <OndemandVideoIcon sx={{ color: "red", fontSize: 32 }} />
          <span className="text-white text-2xl font-bold tracking-tight">
            VideHub
          </span>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="flex items-center w-[40%] max-w-xl">
        <div className="flex flex-1">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 px-3 py-2 bg-[#121212] border border-gray-700 rounded-l-full outline-none"
          />
          <button className="px-4 bg-[#222] border border-gray-700 rounded-r-full">
            <SearchIcon />
          </button>
        </div>

        <div className="ml-3 p-2 bg-[#222] rounded-full cursor-pointer">
          <MicIcon />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5 relative" ref={menuRef}>
        <VideoCallIcon className="cursor-pointer" />
        <NotificationsIcon className="cursor-pointer" />

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="profile"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute top-12 right-0 w-48 bg-[#212121] border border-[#333] rounded-lg shadow-lg py-2">

            <div
              className="px-4 py-2 hover:bg-[#333] cursor-pointer"
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
            >
              Profile
            </div>

            {/* 🔥 Conditional Rendering */}
            {!isAuthenticated ? (
              <div
                className="px-4 py-2 hover:bg-[#333] cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  openAuth("login");
                }}
              >
                Login
              </div>
            ) : (
              <div
                className="px-4 py-2 hover:bg-[#333] cursor-pointer text-red-500"
                onClick={handleLogout}
              >
                Logout
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;