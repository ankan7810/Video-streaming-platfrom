import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import HistoryIcon from "@mui/icons-material/History";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DownloadIcon from "@mui/icons-material/Download";
import SchoolIcon from "@mui/icons-material/School";

const SideBar = ({isOpen}) => {
  return (
    <div className="fixed top-14 left-0 w-60 h-[calc(100vh-56px)] bg-[#0f0f0f] text-white overflow-y-auto border-r border-[#272727] hide-scrollbar">

      <div className="px-3 py-3">

        {/* HOME SECTION */}
        <Section>
          <NavItem icon={<HomeIcon />} text="Home" />
          <NavItem icon={<ExploreIcon />} text="Explore" />
          <NavItem icon={<SmartDisplayIcon />} text="Shorts" />
        </Section>

        <Divider />

        {/* YOU SECTION */}
        <Section title="You">
          <NavItem icon={<HistoryIcon />} text="History" />
          <NavItem icon={<PlaylistPlayIcon />} text="Playlists" />
          <NavItem icon={<AccessTimeIcon />} text="Watch later" />
          <NavItem icon={<ThumbUpIcon />} text="Liked videos" />
          <NavItem icon={<VideoLibraryIcon />} text="Your videos" />
          <NavItem icon={<DownloadIcon />} text="Downloads" />
          <NavItem icon={<SchoolIcon />} text="Courses" />
        </Section>

        <Divider />

        {/* SUBSCRIPTIONS */}
        <Section title="Subscriptions">
          <SubscriptionItem
            img="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            text="CodeWithZeishu"
          />
          <SubscriptionItem
            img="https://cdn-icons-png.flaticon.com/512/147/147144.png"
            text="Cricket.com"
          />
          <SubscriptionItem
            img="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            text="Study IQ"
          />
          <SubscriptionItem
            img="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            text="Tech World"
          />
        </Section>

      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="mb-4">
    {title && (
      <h3 className="text-xs text-gray-400 font-semibold px-3 py-2 uppercase tracking-wider">
        {title}
      </h3>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

const NavItem = ({ icon, text, active }) => (
  <div
    className={`flex items-center gap-6 px-3 py-2 rounded-lg cursor-pointer
      hover:bg-[#272727] transition
      ${active ? "bg-[#272727] font-medium" : ""}`}
  >
    <div className="text-xl">{icon}</div>
    <span className="text-sm">{text}</span>
  </div>
);

const SubscriptionItem = ({ img, text }) => (
  <div className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-[#272727] cursor-pointer transition">
    <img src={img} alt="profile" className="w-6 h-6 rounded-full" />
    <span className="text-sm truncate">{text}</span>
  </div>
);

const Divider = () => (
  <div className="border-t border-[#272727] my-3"></div>
);


export default SideBar;