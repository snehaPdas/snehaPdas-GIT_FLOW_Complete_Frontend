import React, { useState, useEffect } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {Typography,Button,Paper, TextField,} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Review from "./Review";
import { AvgRatingAndReviews,} from "../../types/common";




import API_URL from "../../../axios/API_URL";
import {loadStripe} from '@stripe/stripe-js';
import userAxiosInstance from "../../../axios/userAxiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface ISessionSchedule {
  _id: any;
  price: any;
  selectedDate?: string;
  startDate: string;
  startTime: string;
  endTime: string;
  type: string;
  trainerId: string;
  isBooked: boolean;

}

interface TrainerProfile {
  _id: string;
  name: string;
  profileImage: string;
 specializations: { name: string }[];
}

function TrainersProfileView() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSingleSession, setIsSingleSession] = useState(false);
  const [isPackageSession, setIsPackageSession] = useState(false);
  const [sessionSchedules, setSessionSchedules] = useState<ISessionSchedule[]>([]);
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string | null>(null);
  const [userReviewId, setUserReviewId] = useState<string | null>(null);
  const [avgRatingAndTotalReviews, setAvgRatingAndTotalReviews] = useState<AvgRatingAndReviews[]>([]);

  const { trainerId } = useParams<{ trainerId: string }>();

  
  const userInfo:any=localStorage.getItem("accesstoken")
  
  const parseinfo=JSON.parse(atob(userInfo.split(".")[1]))
  const userId=parseinfo.id
  
  const navigate=useNavigate()

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/api/user/trainers/${trainerId}`);
        if (response.data && response.data.length > 0) {
          setTrainer(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching trainer:", error);
      }
    };

    fetchTrainer();
  }, [trainerId]);

  useEffect(() => {
    const fetchSessionSchedules = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/api/user/schedules`)
       
        const schedules = response.data
        // Filt er and extract available dates
        const date:any = Array.from(
          new Set(
            schedules
              .filter(
                (schedule: { isBooked: any; trainerId: string | undefined; type: string; }) =>
                  !schedule.isBooked &&
                  schedule.trainerId === trainerId &&
                  ((isSingleSession && schedule.type === "single") ||
                    (isPackageSession && schedule.type === "package"))
              )
              .map((schedule: { selectedDate: any; startDate: any; }) =>
                dayjs(schedule.selectedDate || schedule.startDate).format("YYYY-MM-DD")
              )
          )
        );

        setSessionSchedules(schedules);
        setAvailableSlots(date);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSessionSchedules();
  }, []);


  const handleDateChange = (date: any | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      const slots:any = sessionSchedules
        .filter((schedule) => {
          const scheduleDate = dayjs(schedule.selectedDate || schedule.startDate).format(
            "YYYY-MM-DD"
          );
          return (
            scheduleDate === formattedDate &&
            schedule.trainerId.toString() === trainer?._id.toString() &&
            !schedule.isBooked &&
            ((isSingleSession && schedule.type === "single") ||
              (isPackageSession && schedule.type === "package"))
          );
        })
        .map((schedule) => ({
          time: `${schedule.startTime} - ${schedule.endTime}`,
          price: schedule.price,
          id:schedule._id
        }));
        
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleBookSession = (sessionType: string) => {
    setIsSingleSession(sessionType === "single");

    setIsPackageSession(sessionType === "package");
    setSelectedDate(dayjs());
    setAvailableSlots([]);
  };

  const handleConfirmBooking = (slot: string, id: any) => {
    if (selectedDate) {
      alert(`Session booked for ${slot} on ${selectedDate.toDate().toLocaleDateString()}`);
    }
    setSelectedDate(dayjs());
    setAvailableSlots([]);
    setIsSingleSession(false);
    setIsPackageSession(false);
  };

  const availableDates = Array.from(
    new Set(
      sessionSchedules
        .filter(
          (schedule) =>
            !schedule.isBooked &&
            ((isSingleSession && schedule.type === "single") ||
              (isPackageSession && schedule.type === "package"))
        )
        .map((schedule) =>
          dayjs(schedule.selectedDate || schedule.startDate).format("YYYY-MM-DD")
        )
    )
  );

  const handlepayment=async (sessionId: any)=>{
    
    try {
      const response=await userAxiosInstance.post(`/api/user/payment/${sessionId.id}`,{userData:userId})
      
      const stripe=await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      if(stripe){
        await stripe.redirectToCheckout({sessionId:response.data.id})
      }else{
        navigate("/login")
      }
    } catch (error) {
      console.log("error in payment",error)
    }

  }

  useEffect(() => {
    const findBooking = async () => {
      const response = await userAxiosInstance.get(
        `/api/user/bookings/${userId}/${trainerId}`
      );
    
      setBookingStatus(response.data);
    };

    findBooking();
  }, []);

const handleAddReview = () => {
  setIsReviewModalOpen(true);
}
const handleEditReview = () => {
  setIsReviewModalOpen(true);
};

const handleStarClick = (rating: any) => {
  setSelectedRating(rating);
}
const handleReviewSubmit = async () => {
  const data = {
    reviewComment,
    selectedRating,
    userId,
    trainerId,
  };

  const response = await userAxiosInstance.post(`/api/user/review`, data);

  setUserReviewId(response.data.reviewId);
  setIsReviewModalOpen(false);
  setReviewComment(null);
  setSelectedRating(0);
  setReload((prev) => !prev);
  if (response.data.message) {
    toast.success(response.data.message);
  }
};
const handleReviewEdit = async () => {
  
  const data = {
    reviewComment,
    selectedRating,
    userReviewId,
  
  };
  const response = await userAxiosInstance.patch(
    `/api/user/edit-review`,
    data
  );
  setIsReviewModalOpen(false);
  setReviewComment(null);
  setSelectedRating(0);
  setReload((prev) => !prev);
  if (response.data.message) {
    toast.success(response.data.message);
  }
};
useEffect(() => {
  const getAvgRatingAndTotalReviews = async () => {
    const response = await userAxiosInstance.get(
      `/api/user/reviews-summary/${trainerId}`
    );
    setAvgRatingAndTotalReviews(response.data);
  };
  getAvgRatingAndTotalReviews();
}, [trainerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">
  <div className="max-w-3xl mx-auto">
    {/* Trainer Card */}
    <div className="shadow-xl rounded-lg overflow-hidden bg-white">
      <div className="relative">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#572c52] to-purple-500 opacity-70"></div>
        {/* Profile Image */}
        <img
          src={trainer?.profileImage}
          alt="Trainer"
          className="h-40 w-40 mx-auto mt-6 rounded-full border-4 border-white relative z-10"
        />
      </div>
      {/* Trainer Details */}
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">{trainer?.name}</h2>
        <p className="text-gray-500 mt-2">
          <strong>Specializations:</strong> {trainer?.specializations[0]?.name || "N/A"}
        </p>
        <p className="text-gray-700 mt-4">
        <strong> {trainer?.name} </strong>
        Dedicated and experienced professional Fitness Trainer. designs customized workout plans and ensures proper exercise techniques to help individuals improve fitness. Teaching correct movement patterns enhances performance and prevents injuries. Beyond workouts, the trainer educates clients on body awareness and overall health for long-term well-being.
        </p>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => handleBookSession("single")}
            className="px-6 py-2 bg-[#977493] text-white font-semibold rounded-lg shadow hover:bg-[#7b4373] transition transform hover:scale-105"
          >
            Book Single Session
          </button>
          <button
            onClick={() => handleBookSession("package")}
            className="px-6 py-2 bg-[#9d7b99] text-white font-semibold rounded-lg shadow hover:bg-[#7b4373] transition transform hover:scale-105"
          >
            Book Package Session
          </button>
        </div>
      </div>
    </div>

    {/* Session Selection */}
    {
    (isSingleSession || isPackageSession) && (
      <div className="shadow-xl rounded-lg mt-12 p-8 bg-white">
        <h3 className="text-xl font-semibold text-[#0c0c0c] text-center">
          Choose an Available Date
        </h3>
        <div className="mt-6 flex justify-center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              disablePast
              shouldDisableDate={(date) => {
                const formattedDate = date.format("YYYY-MM-DD");
                return !availableDates.includes(formattedDate);
              }}
              slots={{
                textField: TextField,
              }}
              slotProps={{
                textField: { fullWidth: false, variant: "outlined" },
              }}
            />
          </LocalizationProvider>
        </div>

        {/* Slots */}
        {selectedDate && availableSlots.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              Proceed to payment:
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handlepayment(slot)}
                  className="px-4 py-3 bg-[#683f64] text-white font-semibold rounded-lg shadow hover:bg-[#7b4373] transition transform hover:scale-105"
                >
                  {`Session Time: ${slot.time}`} <br />
                  {`Rs. ${slot.price}/- Only`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Slots Available */}
        {selectedDate && availableSlots.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No slots available for the selected date.
          </p>
        )}
      </div>
    )}
  </div>

  <div className="flex justify-center mt-8">
  <h1 className="text-3xl text-gray-500 mt-6 sm:text-2xl sm:mt-4">
  {bookingStatus === "Confirmed" ? "Insights from Our Clients" : ""}
</h1>

      </div>
      {bookingStatus === "Confirmed" ? (
        <div className="flex justify-end mr-10 sm:mr-4">
          {!hasUserReviewed ? (
            <button
              onClick={handleAddReview}
              className="bg-gradient-to-r from-[#f0a3b3] to-[#4b424d] text-white  rounded-full px-4 py-1 text-sm"
              >
              Share Your Experience
            </button>
          ) : (
            <button
              onClick={handleEditReview}
              className="bg-[#572c52] text-white  sm:px-2 sm:py-1 sm:text-sm"
            >
              Edit Review
            </button>
          )}
        </div>
      ) : (
        ""
      )}
      <Review
        trainerId={trainerId}
        reload={reload}
        currentUeser={userInfo?.id}
        onReviewCheck={(hasReview) => setHasUserReviewed(hasReview)}
      />
      
      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-2xl shadow-lg h-[55vh] overflow-y-auto relative sm:p-4 sm:h-auto">
            <h1 className="font-bold text-2xl sm:text-xl">
              {hasUserReviewed ? "Edit Review" : "Write a Review"}
            </h1>
            <h1 className="font-medium mt-3 sm:text-base">Select Your Rating</h1>
            <div className="text-yellow-600 text-lg sm:text-base">
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`w-7 h-7 ms-1 cursor-pointer sm:w-5 sm:h-5 ${star <= selectedRating ? "text-yellow-600" : "text-gray-300"
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                    aria-hidden="true"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
              </div>
              <div className="mt-3">
                <textarea
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Write your review here..."
                  rows={6}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 sm:gap-2 mt-4">
              <button
                className="bg-red-500 px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Close
              </button>
              {!hasUserReviewed ? (
                <button
                  onClick={handleReviewSubmit}
                  className="bg-green-500 px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleReviewEdit}
                  className="bg-blue-500 px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
  
</div>

  );
}

export default TrainersProfileView;
