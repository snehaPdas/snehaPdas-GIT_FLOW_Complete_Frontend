import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import trainerAxiosInstance from "../../../axios/trainerAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IWallet } from "../../types/trainer";
import { formatPriceToINR } from "../../util/timeAndPriceUtils";
import RevenueChart from "./RevenueChart";
import API_URL from "../../../axios/API_URL";


interface Specialization {
  name: string;
  _id: string;
}

interface BookingDetail {
  name: string;
  _id: string;
  startDate: string;
  startTime: string;
  sessionEndTime: string;
  specialization: Specialization;
  sessionType: string;
  paymentStatus: string;
  sessionStatus?: string;
  //userId: string;
  userId: { _id: string; name: string };
  
  
}
interface BookingDetail {
  userId: { _id: string; name: string }; 
}



function TrainerDashboard() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 3;
  const navigate = useNavigate();
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const [walletBalcance, setWalletBalance] = useState<IWallet | null>(null);
  const [dashboardData, setDashboardData] = useState({ trainerRevenue: 0,userTrainerChartData: [],trainerWiseData: {},});
  
   

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!trainerInfo?.id) return;

      try {
        
        const response = await trainerAxiosInstance.get(`/api/trainer/bookingdetails/${trainerInfo.id}`);
        

        const upcomingSessions = response.data.data.filter(
          (session: BookingDetail) => new Date(session.startDate) >= new Date()
        );

        setBookingDetails(upcomingSessions);
      } catch (error) {
        console.error("Error fetching booking details", error);
      }
    };

    fetchBookingDetails();
  }, [trainerInfo.id]);



  useEffect(() => {
    
   const fetchDashboardDatas = async () => {
    
     try {
       
        const response=await trainerAxiosInstance.get(`/api/trainer/dashboard/${trainerInfo.id}` );          
      
        setDashboardData({trainerRevenue: response.data.data.trainerRevenue,  
          userTrainerChartData: response.data.data.userTrainerChartData,
          trainerWiseData:response. data.data.trainerWiseData,


         });
       
      } catch (error: any) {
     // console.error("Error fetching dashboard data", error);
       

     }
   };

    fetchDashboardDatas();
   }, []);


  useEffect(() => {
    const fetchWalletBalance = async () => {
      const response = await trainerAxiosInstance.get( `/api/trainer/wallet-data/${trainerInfo.id}`);
      setWalletBalance(response.data);
    };
    fetchWalletBalance();
  }, []);

  console.log("Chart Data:", dashboardData.userTrainerChartData);


  const uniqueUserIds = new Set(bookingDetails.map(booking => booking.userId._id));
  const totalUsers = uniqueUserIds.size;
  

  // Pagination logic
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = bookingDetails.slice(indexOfFirstSession, indexOfLastSession);

  const totalPages = Math.max(1, Math.ceil(bookingDetails.length / sessionsPerPage));
  

  return (
    <div className="flex-1 p-6 bg-gradient-to-r from-[#f4f4f4] via-[#e3d9e7] to-[#f3f1f5] overflow-y-auto">
      
      <div className="flex flex-col justify-center items-center text-center text-[#1b0f19] mb-8">
     
        <h1 className="text-4xl font-extrabold">
          Welcome to Trainer Dashboard
        </h1>
        <p className="text-xl mt-2">Your overview and management hub</p>
        <div className="relative w-full h-full"></div>
      </div>
      {/* Upcoming Sessions Section */}
      <div className="w-full bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-[#572c52] text-center mb-6">
  Upcoming Training Reminders <span className="text-7xl">⏰</span>
</h2>
          
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-[#572c52] text-white text-lg">
                <th className="py-3 px-6 text-center">Date</th>
                <th className="py-3 px-6 text-center">Time</th>
                <th className="py-3 px-6 text-center">Session Type</th>
                <th className="py-3 px-6 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {currentSessions.length > 0 ? (
                currentSessions.map((session) => (
                  <tr key={session._id} className="border-b border-gray-300 hover:bg-gray-100">
                    <td className="py-3 px-6 text-center">
                      {new Date(session.startDate).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-3 px-6 text-center">{session.startTime}</td>
                    <td className="py-3 px-6 text-center">
                      <span className="bg-[#572c52] text-white px-4 py-1 rounded-full text-sm">
                        {session.sessionType}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`px-4 py-1 rounded-full text-sm text-white ${
                          session.paymentStatus === "Confirmed" ? "bg-[#5a6c5a]" : "bg-red-500"
                        }`}
                      >
                        {session.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No upcoming sessions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="w-full flex justify-between items-center px-4 mt-4">
          <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`h-10 w-28 px-6 py-2 text-black rounded-lg ${
                currentPage === 1 ? "bg-white cursor-not-allowed" : "bg-white"
              }`}
            >
              Previous
            </button>
            <span className="text-[#857f84] font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-black rounded-lg ${
                currentPage === totalPages ? "bg-white cursor-not-allowed" : "bg-white"
              }`}
            >
              Next
            </button>
          </div>
       )} 
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-[#572c52] mb-2">Wallet Balance</h3>
          <p className="text-3xl font-bold text-[#5a6c5a]">{formatPriceToINR(walletBalcance?.balance ?? 0)}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-[#572c52] mb-2">Total Sessions</h3>
          <p className="text-3xl font-bold text-[#572c52]">{bookingDetails.length}</p>
        </div>
      
      <div className=" bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h3 className="text-xl font-semibold text-[#572c52] mb-2">Total Actived Trainees</h3>
      
        <p className="text-3xl font-bold text-[#572c52]">{totalUsers}</p>
         
      </div>
      </div>
      <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
          <RevenueChart data={dashboardData.userTrainerChartData}trainerid={trainerInfo.id }/>
        </div>
     
    </div>
  );
}

export default TrainerDashboard;
