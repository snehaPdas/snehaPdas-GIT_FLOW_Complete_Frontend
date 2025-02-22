import React, { useEffect, useRef, useState } from 'react';
import { FaVideo } from "react-icons/fa";
import trainerAxiosInstance from '../../../axios/trainerAxiosInstance';
import { User } from "../../types/user";
import MessageInputBar from './MessageInputBar';
import userimg from "../../assets/profieicon.png";
import useGetMessage from '../../hooks/useGetMessage';
import { Trainer } from '../../types/trainer';
import { AppDispatch, RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import Message from "./Message";
import { useSocketContext } from '../../context/socket';
import { useDispatch } from 'react-redux';
import { setVideoCall } from '../../features/trainer/TrainerSlice';

interface TrainerChatProps {
  userId: string;
  bookingId: string | null;
}

function TrainerChat({ userId, bookingId }: TrainerChatProps) {
  const trainerToken = localStorage.getItem("trainer_access_token");
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [userData, setUserData] = useState<User | null>(null);
  const { messages, loading } = useGetMessage(trainerToken!, userId!);
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);
  const [localMessages, setLocalMessages] = useState(messages);
  const { socket } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await trainerAxiosInstance.get(`/api/trainer/users/${userId}`);
      setUserData(response.data);
    };
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const fetchTrainer = async () => {
      const response = await trainerAxiosInstance.get(`/api/trainer/${trainerInfo.id}`);
      setTrainerData(response.data.trainerData[0]);
    };
    fetchTrainer();
  }, [trainerInfo.id, userId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join", trainerInfo?.id || userInfo?.id);
    const handleNewMessage = (newMessage: any) => {
      setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on("messageUpdate", handleNewMessage);
    return () => {
      socket.off("messageUpdate", handleNewMessage);
    };
  }, [socket, trainerInfo?.id, userInfo?.id]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages,socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const navigateVideoChat = () => {
    dispatch(
      setVideoCall({
        userID: userId || "",
        type: "out-going",
        callType: "video",
        roomId: `${Date.now()}`,
        userName: `${userData?.name}`,
        userImage: `${userData?.image}`,
        trainerName: `${trainerData?.name}`,
        trainerImage: `${trainerData?.profileImage}`,
        bookingId: `${bookingId}`,
      })
    );
  };
console.log("localmessageeeeeeeeeee",localMessages)
  return (
    <div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-[82vh]">
      <div className="bg-gray-500 px-4 py-2 mb-2 h-14 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-start gap-5">
          <img className="h-10 w-10 rounded-full" src={userimg} alt="user" />
          <h1 className="text-lg text-white font-medium">{userData?.name}</h1>
        </div>
        <button
          className="flex justify-center gap-3 bg-[#572c52] px-4 py-2 rounded-lg"
          onClick={navigateVideoChat}
        >
          <h1 className="text-1xl text-white">Start Session</h1>
          <FaVideo className="h-6 w-6" />
        </button>
      </div>

      {/* Messages Section */}
      <div className="px-4 flex-1 overflow-y-auto mt-2 overflow-x-hidden">
        {
        // loading ? (
        //   <div><MessageSkeleton /></div>
        // ) : (
          localMessages.map((msg, index) => (
            <Message
              key={index}
              sender={
                msg?.senderModel
                  ? (msg.senderModel.charAt(0).toUpperCase() + msg.senderModel.slice(1)) as 'User' | 'Trainer'
                  : 'User'
              }
              message={msg.message}
              time={new Date(msg.createdAt).toLocaleTimeString()}
              userImage={userData?.image || userimg}
              trainerImage={trainerData?.profileImage}
        

            />
          ))
        // )
        }
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800">
        <MessageInputBar userId={userId} onNewMessage={() => {}} />
      </div>
    </div>
  );
}

export default TrainerChat;
