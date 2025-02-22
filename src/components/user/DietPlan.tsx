import React, { useState, useEffect } from "react";
import userAxiosInstance from "../../../axios/userAxiosInstance";
import API_URL from "../../../axios/API_URL";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Trainer } from "../../types/trainer";
import dietimg from "../../assets/dietplans.jpg";

function DietPlan() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [dietPlan, setDietPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = userInfo?.id;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/api/user/booking-details`);
        const TrainerIdseen = new Set();
        const uniqueUsers = response.data.data.filter((booking: any) => {
          if (!booking.userId || !booking.trainerId._id) return false;
          if (TrainerIdseen.has(booking.trainerId._id)) return false;
          TrainerIdseen.add(booking.trainerId._id);
          return true;
        });

        setTrainers(uniqueUsers.map((booking: any) => ({
          trainerId: booking.trainerId,
          bookingId: booking._id,
          trainerName: booking.trainerId.name
        })));
      } catch (error: any) {
        console.error("Error fetching trainer:", error.response?.data || error.message);
      }
    };

    fetchTrainers();
  }, []);

  const fetchDietPlan = async (trainerId: string) => {
    setLoading(true);
    try {
      const response = await userAxiosInstance.get(`${API_URL}/api/user/dietplan/${trainerId}/${userId}`);
      setDietPlan(response.data);
    } catch (error: any) {
      console.error("Error fetching diet plan:", error.response?.data || error.message);
      setDietPlan(null);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${dietimg})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h2 className="text-2xl font-extrabold mb-5 text-center text-[#572c52]">Select a Trainer for Your Diet Plan</h2>

        {trainers.length === 0 ? (
          <p className="text-center text-gray-600">No trainers available.</p>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {trainers.map((trainer) => (
              <button
                key={trainer.trainerId._id}
                onClick={() => {
                  setSelectedTrainer(trainer.trainerId._id);
                  fetchDietPlan(trainer.trainerId._id);
                }}
                className="p-3 bg-[#572c52] text-white rounded-lg hover:bg-[#8a4d76] transition shadow-md w-40"
              >
                {trainer.trainerName}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="mt-4 text-blue-500 text-center">Loading diet plan...</p>}

        {!loading && selectedTrainer && dietPlan && (
          <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3 text-center text-[#572c52]">Your Personalized Diet Plan</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-lg shadow-md">
              <p className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">🍽️ Morning (7:00 AM)</span>
                <span className="font-medium text-[#572c52]">{dietPlan.morning}</span>
              </p>
              <p className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">🍛 Lunch (12:00 PM)</span>
                <span className="font-medium text-[#572c52]">{dietPlan.lunch}</span>
              </p>
              <p className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">☕ Evening (3:00 PM)</span>
                <span className="font-medium text-[#572c52]">{dietPlan.evening}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">🌙 Night (6:30 PM)</span>
                <span className="font-medium text-[#572c52]">{dietPlan.night}</span>
              </p>
            </div>

            <p className="mt-4 text-lg font-bold text-center">
              Total Calories: <span className="text-[#572c52]">{dietPlan.totalCalories}</span>
            </p>

            <p className="text-sm text-gray-500 mt-2 text-center">
              Created on: {new Date(dietPlan.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {!loading && selectedTrainer && !dietPlan && (
          <p className="text-center text-red-500 mt-4">No diet plan available.</p>
        )}
      </div>
    </div>
  );
}

export default DietPlan;
