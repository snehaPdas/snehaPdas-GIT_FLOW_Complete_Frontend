import React from 'react';
import { useParams } from "react-router-dom";
import Message from "./message";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import  io from "socket.io-client";
import Socket  from "socket.io-client";
import {useSocketContext} from '../../context/socket'
import axios from "axios";
import API_URL from "../../../axios/API_URL";
import userAxiosInstance from "../../../axios/userAxiosInstance";
import { User } from "../../types/user";
import MessageSkeleton from "../../skelton/MessageSkelton";
import { useState,useEffect } from 'react';
import MessageInpurBar from './MessageInpurBar';
import useGetMessage from "../../hooks/useGetMessage";
import userimg from "../../assets/profieicon.png"

interface TrainerChatProps {
  trainer: {
    trainerId?: any;
    trainerName: string;
    profileImage: string;
};
  }

function UserChat({trainer}:TrainerChatProps) {
   const [trainerData, setTrainerData] = useState<{name: string, profileImage: string} | null>(null)
    const [userData, setUserData] = useState<User | null>(null)
    useSelector((state: RootState) => state.user);
    const {  trainerInfo } = useSelector((state: RootState) => state.trainer);
    const token=localStorage.getItem("accesstoken")
    const {  userInfo } = useSelector((state: RootState) => state.user);

    const { messages,loading } = useGetMessage(token!, trainer.trainerId);
    const [localMessages, setLocalMessages] = useState(messages);
    let {socket}  = useSocketContext()

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
        
        

        const fetchTrainerData = async () => { 
     
          try{
          const response =  await userAxiosInstance(`${API_URL}/api/user/trainers/${trainer.trainerId}`);
          setTrainerData(response.data[0]);
          }catch(error){
               console.log("Ërror in fetching trainer data",error)
          }

        }
        fetchTrainerData();
      }, [socket, trainer.trainerId]);

      useEffect(() => {
        setLocalMessages(messages); 
      }, [messages]);
      

      const handleNewMessage = (newMessage: any) => {
      
        
        setLocalMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            (msg) => msg._id === newMessage._id || (msg.createdAt === newMessage.createdAt && msg.message === newMessage.message)
          );
          return isDuplicate ? prevMessages : [...prevMessages, newMessage];
        });
      };


      
  return (
    <div className="w-full h-[85vh] flex flex-col bg-gray-900 text-white shadow-xl rounded-lg overflow-hidden border border-gray-700">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#572c52] to-[#572c52] px-5 py-3 flex items-center sticky top-0 z-10 shadow-md">
        <img className="h-12 w-12 rounded-full border-2 border-white" src={trainer?.profileImage} alt="profile" />
        <h1 className="text-lg font-semibold ml-4">{trainer?.trainerName}</h1>
      </div>
      <div className="px-4 flex-1 overflow-y-auto mt-2 overflow-x-hidden ">
        {
        // loading ? (
        //   <div><MessageSkeleton /></div>
        // ) : (
          localMessages.map((msg, index) => (
            <Message
              key={index}
              sender={msg?.senderModel ? (msg.senderModel.charAt(0).toUpperCase() + msg.senderModel.slice(1)) as 'User' | 'Trainer' : 'User'}
              message={msg.message}
              time={new Date(msg.createdAt).toLocaleTimeString()}
              userImage={userimg} 
              trainerImage={trainerData?.profileImage}
            />
          ))
        // )
        }
      </div>

        
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800 sticky bottom-0 z-10">
        <MessageInpurBar trainerId={trainer.trainerId} onNewMessage={handleNewMessage} />
      </div>

    </div>
  );  
}


export default UserChat
