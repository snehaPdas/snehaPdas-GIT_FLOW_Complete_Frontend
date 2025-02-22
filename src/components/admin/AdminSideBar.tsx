import React, { useState } from "react";
import { Link } from "react-router-dom";
import LOGO from "../../assets/logo_fitglow.png";
import {
  FaBars,
  FaChartPie,
  FaListAlt,
  FaUsers,
  FaSignOutAlt,
  FaCheckCircle,
} from "react-icons/fa";

function AdminSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <div
        className={`h-screen bg-[#572c5f] text-white flex flex-col p-5 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-58"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <button onClick={toggleSidebar} className="text-white">
            {isSidebarOpen ? <FaBars size={24} /> : <FaBars size={24} />}
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
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Dashboard
            </span>
          </Link>

          <Link
            to="/admin/specialisations"
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaListAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Specializations
            </span>
          </Link>
          <Link
            to="/admin/verification"
            className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <FaCheckCircle size={20} />
            <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>
              Verification
            </span>
          </Link>

          {/* <Link
            to=""
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Trainers
            </span>
          </Link> */}
          <Link
            to="/admin/user-listing"
            className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-all duration-200"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Users</span>
          </Link>

          {/* Logout Button */}
          <Link
            to="/admin/login"
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

export default AdminSideBar;
