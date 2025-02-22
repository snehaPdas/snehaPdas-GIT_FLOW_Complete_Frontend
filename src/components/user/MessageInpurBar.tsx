import React from 'react'
import { BsSend } from "react-icons/bs";
import { useState } from 'react';
import { useSocketContext } from '../../context/socket';
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import useSendMessage from '../../hooks/useSendMessage';



interface MessageInputBarProps {
    trainerId?: string; 
    onNewMessage: (message: any) => void;
  }

function MessageInpurBar({ trainerId, onNewMessage }:MessageInputBarProps) {

    const [message, setMessage] = useState('');
    const { userInfo } = useSelector((state: RootState) => state.user);
   
    const { sendMessage } = useSendMessage();
  
    const { socket } = useSocketContext();
  
    const userId = userInfo?.id
    const token = localStorage.getItem("accesstoken") ?? "";

   

   const handleSendMessage = async (e: React.FormEvent<HTMLElement>) => {
      
        e.preventDefault();
        if (!message) return;
        
        
    const receiverId = trainerId ?? "defaultTrainerId";
    const newMessage = {
      message,
      receiverId,
      senderModel: "User",
      createdAt: new Date().toISOString(),
      userId: userId
    };

    console.log("socket is.......",socket)

        if (socket) {
            
            socket.emit("sendMessage", newMessage); 
          } else {
            console.error("Socket is not initialized");
          }

          console.log("the new message is",newMessage)
        onNewMessage(newMessage);
        setMessage("");

          await sendMessage({ message, receiverId, token });
         
         
        }
        


  return (
    <form onSubmit={handleSendMessage} className="relative w-full">
    <input
      onChange={(e) => setMessage(e.target.value)}
      value={message}
      type="text"
      className="border text-sm rounded-lg block w-full p-2.5 pr-10 bg-gray-700 border-gray-600 text-white"
      placeholder="Send a message"
    />
    <button
      type="submit"
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-white"
    >
      <BsSend />
    </button>
  </form>
  )
}

export default MessageInpurBar

