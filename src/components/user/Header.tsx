import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo_img from "../../assets/logo_fitglow.png";
import profileicon from '../../assets/profieicon.png';
import { BsBell } from "react-icons/bs";
import { useNotification } from "../../context/NotificationContext";
import userAxiosInstance from '../../../axios/userAxiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import toast, { Toaster } from "react-hot-toast";


interface INotificationContent {
  content: string;
  bookingId: string;
  read: boolean;
}

export interface INotification {
  _id?: string;
  receiverId?: string;
  notifications?: INotificationContent[];
  createdAt?: string;
  updatedAt?: string;
}

function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null); // Ref for the dropdown
  const [isNotificationOpen,setIsNotificationOpen]=useState(false)
  const[notificationsData,setNotificationsData]=useState()
  const { userInfo } = useSelector((state: RootState) => state.user);
  const {addUserNotification,clearUserNotifications, userNotifications, updateUserNotificationReadStatus, countUnreadNotificationsUser} = useNotification();


  const navigate = useNavigate();

  // Handle Logout
  function handleLogout() {
    localStorage.removeItem("accesstoken");
    navigate("/login");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false); // Close the dropdown
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await userAxiosInstance.get(
          `/api/user/notifications/${userInfo?.id}`
        );
        const serverNotifications = response.data?.notifications ?? [];
        serverNotifications.forEach((notif: any) => {
          if (notif && notif.content) {
            addUserNotification(notif.content);
          }
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [userInfo?.id]);

  const handleClear = async () => {
    try {
      const response = await userAxiosInstance.delete(
        `/api/user/clear-notifications/${userInfo?.id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        clearUserNotifications();
      } else {
        console.error("Failed to clear notifications. Please try again.");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };


  return (
<header className="w-full bg-white text-[#572c5f] p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-semibold">
          <img src={logo_img} alt="Logo" className="w-24" />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="/home" className="hover:text-[#d9a8d4] transition">Home</a>
          <a href="/aboutUs" className="hover:text-[#d9a8d4] transition">About</a>
          <a href="/trainers" className="hover:text-[#d9a8d4] transition">Trainers</a>
          <a href="#" className="hover:text-[#d9a8d4] transition">Contact</a>
        </nav>

        {/* notification  */}
        <div className="flex items-center space-x-3">
        <div className="relative z-50 ">
          <BsBell 
            className="h-6 w-6 text-[#572c5f] cursor-pointer" 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
          />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                {/* { userNotifications?.length} */}
                {countUnreadNotificationsUser}
              </span>
        </div>
        {
            isNotificationOpen && (
              <div className="absolute top-10 right-0 w-[320px] bg-white shadow-lg rounded-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Notifications
                </h3>
                {userNotifications?.length ? (
                  <>
                    <ul className="space-y-3 mt-2 max-h-64 overflow-y-auto">
                      {userNotifications?.length > 0 ? (
                        <>
                          {userNotifications.map((notification, index) => (
                            <li
                              key={index}
                              // onClick={() => handleReadUnread(notification.id)}
                              className={`text-sm text-gray-700 border-b pb-2 ${
                                notification.read
                                  ? "opacity-50 bg-gray-100"
                                  : "bg-[#dce1d9]"
                              }`}
                            >
                              {typeof notification.message === "string"
                                ? notification.message
                                : "Invalid message"}
                            </li>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No new notifications
                        </p>
                      )}
                    </ul>
                    <div onClick={handleClear} className="flex justify-end">
                      <button className="text-gray-800">Clear</button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No new notifications</p>
                )}
              </div>
            )}

        {/* User Profile */}
        <div className="relative" ref={profileMenuRef}>
          <img
            alt="user profile"
            src={profileicon}
            className="h-10 w-10 cursor-pointer rounded-full object-cover"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          />
          {isProfileMenuOpen && (
            <ul
              role="menu"
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white text-gray-800"
            >
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/profile">My Profile</Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
        </div>
        
        
      </div>
    </header>
  );
}

export default Header;
