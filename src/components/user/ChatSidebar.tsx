import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userAxiosInstance from "../../../axios/userAxiosInstance";
import UserChat from "./UserChat";
import API_URL from "../../../axios/API_URL";
import { RootState } from "../../app/store";
import { User } from "../../types/user";

interface Trainer {
  trainerId: string;
  trainerName: string;
  profileImage: string;
  hasNewMessage: boolean;
  messageCount: number;
}

function ChatSidebar() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const userId = userInfo?.id;
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/api/user/booking-details`);
        const TrainerIdseen = new Set();
        const uniqueTrainers = response.data.data.filter((book: any) => {
          if (TrainerIdseen.has(book.trainerId._id)) {
            return false;
          }
          TrainerIdseen.add(book.trainerId._id);
          return true;
        });

        setTrainers(
          uniqueTrainers.map((book: any) => ({
            trainerId: book.trainerId._id,
            trainerName: book.trainerName,
            profileImage: book.trainerId.profileImage,
            hasNewMessage: book.hasNewMessage || false,
            messageCount: book.messageCount || 0,
          }))
        );
      } catch (error) {
        console.log("Error fetching trainer details", error);
      }
    };
    fetchTrainers();
  }, []);

  const handleTrainerSelect = (trainerId: string) => {
    setSelectedTrainerId(trainerId);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white shadow-lg border-r border-gray-700">
      {/* SIDEBAR */}
      <div className="w-full sm:w-80 bg-gray-900 text-white shadow-lg border-r border-gray-700 flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-500 to-[#572c52] px-5 py-4 flex items-center shadow-md">
          <h1 className="text-lg font-semibold">Chats</h1>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-gray-800 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572c52]"
          />
        </div>

        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          {trainers.length > 0 ? (
            trainers.map((trainer) => (
              <div
                key={trainer.trainerId}
                onClick={() => handleTrainerSelect(trainer.trainerId)}
                className={`flex items-center justify-between mb-2 border-b border-gray-200 pb-2 cursor-pointer rounded-md ${
                  selectedTrainerId === trainer.trainerId
                    ? "bg-[#572c52] text-white"
                    : "bg-blue-100 text-gray-800"
                } transition-all`}
              >
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={trainer.profileImage}
                    alt={`${trainer.trainerName}'s Avatar`}
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{trainer.trainerName}</h3>
                    {trainer.hasNewMessage && (
                      <span className="text-sm text-red-500">
                        New Message ({trainer.messageCount})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-8">
              <p>No trainers found to chat with.</p>
            </div>
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-auto shadow-lg bg-gray-800">
        {selectedTrainerId ? (
          <UserChat
            trainer={
              trainers.find((trainer) => trainer.trainerId === selectedTrainerId) || {
                trainerName: "",
                profileImage: "",
              }
            }
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-xl">Select a trainer to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;
