import { GrMoney } from "react-icons/gr";
import { FaSignOutAlt, FaUser ,FaRegCalendarAlt} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import adminAxiosInstance from "../../../axios/adminAxiosInstance";
import RevenueChart from "./RevenueChart";
import UserTrainerChart from "./UserTrainerChart";



function AdminDashboard() {

  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalTrainers: 0,
    activeUsers: 0,
    adminRevenue: 0,
    trainerRevenue: 0,
    activeTrainers: 0,
    totalBookings:0,
    userTrainerChartData

: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await adminAxiosInstance.get(`/api/admin/dashboardData`); 

        setDashboardData({
          totalRevenue: response.data.data.totalRevenue,
          totalUsers: response.data.data.totalUsers,
          totalTrainers: response.data.data.totalTrainers,
          activeUsers: response.data.data.activeUsers,
          adminRevenue: response.data.data.adminRevenue,
          trainerRevenue: response.data.data.trainerRevenue,  
          activeTrainers: response.data.data.activeTrainers,
          userTrainerChartData: response.data.data.userTrainerChartData,
          totalBookings:response.data.data.totalBookings
        });
        
      } catch (error: any) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);




  return (
  
    <div
      className="flex flex-col p-6 space-y-8 min-h-screen bg-gradient-to-r"
      style={{ background: "linear-gradient(to right, #fffff, #ffffff)" }}
    >
      <div className="flex flex-col justify-center items-center text-center text-[#1b0f19] mb-8">
        <h1 className="text-4xl font-extrabold">
          Welcome to Admin's Dashboard
        </h1>
        <p className="text-xl mt-2">Your overview and management hub</p>
        <div className="relative w-full h-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#70466c] to-[#1b0f19] text-white rounded-xl shadow-lg p-8 hover:scale-105 transition-all duration-300 transform hover:bg-green-700">
          <div className="flex items-center space-x-4">
            <GrMoney size={40} />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Total Revenue</h1>
              <h3 className="text-3xl font-bold mt-2">{dashboardData.totalRevenue}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#94668f] to-[#1b0f19] text-white rounded-xl shadow-lg p-8 hover:scale-105 transition-all duration-300 transform hover:bg-[#572c52]">
          <div className="flex items-center space-x-4">
            <FaUser size={40} />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Total Users</h1>
              <h3 className="text-3xl font-bold mt-2">{dashboardData.totalUsers}</h3>
              <h1 className="text-lg font-semibold mt-4">Active Users</h1>
              <h3 className="text-2xl mt-1">{dashboardData.activeUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#94668f] to-[#1b0f19] text-white rounded-xl shadow-lg p-8 hover:scale-105 transition-all duration-300 transform hover:bg-yellow-700">
          <div className="flex items-center space-x-4">
            <FaUser size={40} />

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Total Trainers</h1>
              <h3 className="text-3xl font-bold mt-2">{dashboardData.totalTrainers}</h3>
              <h1 className="text-lg font-semibold mt-4">Active Trainers</h1>
              <h3 className="text-2xl mt-1">{dashboardData.activeTrainers}</h3>
            </div>
          </div>
        </div>


        <div className="bg-gradient-to-r from-[#94668f] to-[#1b0f19] text-white rounded-xl shadow-lg p-8 hover:scale-105 transition-all duration-300 transform hover:bg-yellow-700">
          <div className="flex items-center space-x-4">
            <GrMoney size={40} />

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Admin Revenue</h1>
              <h3 className="text-3xl font-bold mt-2">{dashboardData.adminRevenue}</h3>
              
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#94668f] to-[#1b0f19] text-white rounded-xl shadow-lg p-8 hover:scale-105 transition-all duration-300 transform hover:bg-yellow-700">
          <div className="flex items-center space-x-4">
            <GrMoney size={40} />

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Trainer Revenue</h1>
              <h3 className="text-3xl font-bold mt-2">{dashboardData.trainerRevenue}</h3>
              
            </div>

            
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#94668f] to-[#1b0f19] text-white rounded-xl shadow-lg p-8 hover:scale-105 transition-all duration-300 transform hover:bg-yellow-700">
          <div className="flex items-center space-x-4">
            <FaRegCalendarAlt size={40} />

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Total Bookings</h1>
              <h3 className="text-3xl font-bold mt-2">{dashboardData.totalBookings}</h3>
              
            </div>

            
          </div>
        </div>

      </div>
      

      <div className="flex flex-col justify-center items-center text-center text-[#1b0f19] mb-8 mt-5">
        <h1 className="text-2xl font-extrabold">
        Monthly Revenue and User Registrations
        </h1>
        </div>

      <div className="w-[100%] h-[450px] flex space-x-10">
      

        <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
          <RevenueChart data={dashboardData.userTrainerChartData} />
        </div>
        <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
          <UserTrainerChart data={dashboardData.userTrainerChartData} />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 max-w-7xl mx-auto"></div>
    </div>
  );
}

export default AdminDashboard;
