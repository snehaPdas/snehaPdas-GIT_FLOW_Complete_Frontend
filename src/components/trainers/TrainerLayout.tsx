import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { Outlet, useNavigate } from "react-router-dom";
import TrainerSideBar from "./TrainerSideBar";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import img from "../../assets/cartoon1234567.jpg";
import { useNotification } from "../../context/NotificationContext";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import trainerAxiosInstance from "../../../axios/trainerAxiosInstance";
import toast, { Toaster } from "react-hot-toast";

interface Notification {
  content: string;
  read: boolean;
  createdAt: string;
}


const TrainerLayout: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const {trainerNotifications, addTrainerNotification, clearTrainerNotifications, updateTrainerNotificationReadStatus} = useNotification();

  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsNotificationOpen(false); 
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileDropdownOpen(false); 
  };



  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node) &&
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setIsProfileDropdownOpen(false);
      setIsNotificationOpen(false);
    }
  };

  useEffect(()=>{
    const fetchNotification =async()=>{
      try {
        if(trainerInfo._id){
          const response=await trainerAxiosInstance.get( `/api/trainer/notifications/${trainerInfo.id}`)
          const serverNotifications = response.data.notifications || [];
          serverNotifications.forEach((notif: { content: string }) => {
            addTrainerNotification(notif.content);
          }
        );
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);

      }
    }
    fetchNotification()
  },[trainerInfo?._id])

  const handleClear = async () => {
    try {
      const response = await trainerAxiosInstance.delete(
        `/api/trainer/clear-notifications/${trainerInfo?.id}`
      );

      if (response.status === 200) {
        clearTrainerNotifications();
        toast.success(response.data.message);
      } else {
        toast.error("Failed to clear notifications.");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("An error occurred while clearing notifications.");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-100">
      {/* Sidebar - Hidden on small screens */}
      <div className="hidden md:block">
        <TrainerSideBar />
      </div>
  
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Quote Section (Status Bar) */}
        <section className="bg-gradient-to-r from-white to-white py-2 px-4 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 sm:space-x-10">
            <FaQuoteLeft className="text-2xl sm:text-3xl text-[#572c52]" />
            <p className="text-sm sm:text-lg font-semibold text-center sm:text-left text-[#572C57]">
              Train in confidence, believe in yourself.
            </p>
            <FaQuoteRight className="text-2xl sm:text-3xl text-[#572c52]" />
            <div className="w-52 sm:w-80 h-auto overflow-hidden">
              <img src={img} alt="Cartoon illustration" className="w-full h-auto object-contain" />
            </div>
          </div>
  
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <BsBell className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer text-[#572c52]" onClick={toggleNotificationDropdown} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                {trainerNotifications.length}
              </span>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-60 sm:w-64 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Notifications</h3>
                    {trainerNotifications.length > 0 ? (
                      <>
                        <ul className="space-y-3 mt-2 max-h-64 overflow-y-auto">
                          {trainerNotifications.map((notification, index) => (
                            <li
                              key={index}
                              className={`text-sm text-gray-700 border-b pb-2 ${
                                notification.read ? "opacity-50 bg-gray-100" : "bg-[#e0f0e0]"
                              }`}
                            >
                              {typeof notification.message === "string" ? notification.message : "Invalid message"}
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-end mt-2">
                        <button
                          onClick={handleClear}
                          className="text-gray-800"
                        >
                          Clear
                        </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No new notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>
  
            {/* Profile Icon */}
            <div className="relative" ref={profileRef}>
              <FaUserCircle className="text-xl sm:text-2xl cursor-pointer text-[#572c52]" onClick={toggleProfileDropdown} />
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/trainer/profile")}>
                      My Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/trainer/login")}>
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
  
        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 bg-slate-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default TrainerLayout;
