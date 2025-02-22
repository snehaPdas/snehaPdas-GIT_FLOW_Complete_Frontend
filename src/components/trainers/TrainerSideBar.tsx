import React, { useState } from "react";
import { Link } from "react-router-dom";

import LOGO from "../../assets/logo_fitglow.png";
import {
  FaBars,
  FaChartPie,
  FaListAlt,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

function TrainerSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-[#572c5f] text-white flex flex-col p-5 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} md:w-64`} // Change width for small screens
      >
        <div className="flex justify-between items-center mb-6">
          <button onClick={toggleSidebar} className="text-white">
            <FaBars size={24} />
          </button>
          {isSidebarOpen && (
            <div className="flex items-center justify-center">
              <img className="w-12 h-12 rounded-full" src={LOGO} alt="Logo" />
            </div>
          )}
        </div>

        <nav className="flex flex-col space-y-6">
          <Link
            to=""
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaChartPie size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Dashboard</span>
          </Link>

          <Link
            to="profile"
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaListAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Profile</span>
          </Link>

          <Link
            to="/trainer/chat-sidebar"
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Message</span>
          </Link>

          <Link
            to="/trainer/schedulesessions"
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Schedule Session</span>
          </Link>

          {/* diet plan */}
          <Link
            to="/trainer/dietplan"
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Diet Plan</span>
          </Link>
          {/* wallet */}
          <Link
            to="/trainer/wallet"
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Wallet</span>
          </Link>


          {/* Logout Button */}
          <Link
            to=""
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaSignOutAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default TrainerSideBar;
