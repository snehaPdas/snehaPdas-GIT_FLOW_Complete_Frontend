import React, { useState, useEffect } from "react";
import userAxiosInstance from "../../../axios/userAxiosInstance";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../../axios/API_URL";
import Swal from "sweetalert2";

interface BookingDetail {
  trainerId: { _id: string };
  name: string;
  _id: string;
  startDate: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  paymentStatus: string;
  sessionStatus?: string;
  userId: string;
  bookingDate: string;
  trainerName: string;
}

function Bookings() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5; // Number of bookings per page

  const fetchBookingDetails = async () => {
    try {
      const response = await userAxiosInstance.get(`${API_URL}/api/user/booking-details`);
      setBookingDetails(response.data.data);
    } catch (error) {
      console.log("Error in fetching booking details", error);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const handleCancel = async (sessionId: string, userId: string, trainerId: string) => {
    const result = await Swal.fire({
      title: "Do you want to cancel this session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await userAxiosInstance.post(`${API_URL}/api/user/cancel-session`, {
          sessionId,
          userId,
          trainerId,
        });

        Swal.fire("Refunded!", "Your session has been cancelled and refunded.", "success");

        fetchBookingDetails();
      } catch (error) {
        Swal.fire("Error!", "Failed to cancel the session. Try again later.", "error");
      }
    }
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookingDetails.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookingDetails.length / bookingsPerPage);

  return (
    <div className="flex-1 p-8 bg-gradient-to-r from-[#f7f7f7] via-[#e6d5eb] to-[#f6edf7] overflow-y-auto min-h-screen">
      <div className="flex justify-between items-center border-b pb-6 mb-6">
        <h1 className="text-4xl font-bold text-[#572c52] text-center flex-1">My Bookings</h1>
        <div className="bg-white shadow-lg rounded-xl p-4 text-center">
          <h3 className="text-lg font-semibold text-[#572c52] mb-2">Total Sessions</h3>
          <p className="text-3xl font-bold text-[#572c52]">{bookingDetails.length}</p>
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-7 gap-4 text-center text-[#572c52] text-lg font-semibold border-b border-gray-300 pb-3">
          <div>Trainer</div>
          <div>Booking Date</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Session Type</div>
          <div>Payment Status</div>
          <div>Action</div>
        </div>

        {currentBookings.length > 0 ? (
          currentBookings.map((session) => (
            <div
              key={session._id}
              className="grid grid-cols-7 gap-4 items-center p-4 hover:bg-gradient-to-r from-[#e6d5eb] via-[#f3c6d3] to-[#f6edf7] transition-all border-b border-gray-300 rounded-lg"
            >
              <div className="text-center text-[#333] font-medium">{session.trainerName}</div>
              <div className="text-center text-[#333] font-medium">
                {new Date(session.bookingDate).toLocaleDateString()}
              </div>
              <div className="text-center text-[#333] font-medium">{session.startTime}</div>
              <div className="text-center text-[#333] font-medium">{session.endTime}</div>
              <div className="text-center font-medium">
                <span className="bg-gradient-to-r from-[#9e7cc2] to-[#572c52] text-white rounded-full px-4 py-1 text-sm">
                  {session.sessionType}
                </span>
              </div>
              <div className="text-center font-medium">
                <span
                  className={`px-4 py-1 rounded-full text-sm text-white ${
                    session.paymentStatus === "Confirmed" ? "bg-[#5a6c5a]" : "bg-red-500"
                  }`}
                >
                  {session.paymentStatus}
                </span>
              </div>
              <div className="text-center">
                <button
                  className="bg-gradient-to-r from-[#f0a3b3] to-[#4b424d] text-white  rounded-full px-4 py-1 text-sm"
                  onClick={() => handleCancel(session._id, session.userId, session.trainerId._id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No more upcoming sessions.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-[#572c52] text-white"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2 text-[#572c52] font-bold">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-[#572c52] text-white"
          }`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Bookings;
