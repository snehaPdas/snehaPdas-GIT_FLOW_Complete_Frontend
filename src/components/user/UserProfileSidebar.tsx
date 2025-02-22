import React from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt,FaComments,FaCalendarAlt,FaDumbbell  } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate=useNavigate()

  function handleLogout() {
    localStorage.removeItem("accesstoken");
    navigate("/login");
  }
  return (
    <div className="w-64 h-screen bg-gradient-to-br from-[#572c52] to-[#a485a1] text-white flex flex-col shadow-lg">
      {/* Logo / Branding */}
      <div className="text-center text-xl font-bold py-5 border-b border-white/20">
      User Dashboard
      </div>

      {/* Menu */}
      <ul className="flex-grow">
        <NavLink to="/profile" className={({ isActive }) => 
          `flex items-center p-4 transition duration-300 cursor-pointer ${
            isActive ? "bg-white/20" : "hover:bg-white/10"
          }`
        }>
          <FaUser className="text-xl mr-3" />
          <span className="text-lg">Profile</span>
        </NavLink>

        <NavLink to="bookings" className={({ isActive }) => 
          `flex items-center p-4 transition duration-300 cursor-pointer ${
            isActive ? "bg-white/20" : "hover:bg-white/10"
          }`
        }>
          <FaCalendarAlt className="text-xl mr-3" />
          <span className="text-lg">Booking</span>
        </NavLink>

        <NavLink to="/session" className={({ isActive }) => 
          `flex items-center p-4 transition duration-300 cursor-pointer ${
            isActive ? "bg-white/20" : "hover:bg-white/10"
          }`
        }>
          <FaDumbbell  className="text-xl mr-3" />
          <span className="text-lg">sessions</span>
        </NavLink>

        

        <NavLink to="message" className={({ isActive }) => 
          `flex items-center p-4 transition duration-300 cursor-pointer ${
            isActive ? "bg-white/20" : "hover:bg-white/10"
          }`
        }>
          <FaComments  className="text-xl mr-3" />
          <span className="text-lg">Message</span>
        </NavLink>

        <NavLink to="dietplan" className={({ isActive }) => 
          `flex items-center p-4 transition duration-300 cursor-pointer ${
            isActive ? "bg-white/20" : "hover:bg-white/10"
          }`
        }>
          <FaCalendarAlt  className="text-xl mr-3" />
          <span className="text-lg">DietPlan</span>
        </NavLink>

        < div className="flex items-center p-4 hover:bg-[#cb8585] transition duration-300 cursor-pointer">
          <FaSignOutAlt className="text-xl mr-3" />
          <span className="text-lg" onClick={handleLogout}>Logout</span>
          </div>

      </ul>
    </div>
  );
};

export default Sidebar;
