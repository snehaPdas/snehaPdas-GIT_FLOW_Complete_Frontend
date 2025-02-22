import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { AppDispatch, RootState } from "../app/store";
import {
  endCallTrainer,
  setVideoCall,
  setShowVideoCall,
  setRoomId,
} from "../features/trainer/TrainerSlice";
import {
  endCallUser,
  setShowIncomingVideoCall,
  setRoomIdUser,
  setShowVideoCallUser,
  setVideoCallUser,
} from "../features/user/userSlice";
import toast from "react-hot-toast";
import { useNotification } from "./NotificationContext";

type SocketType = ReturnType<typeof io>;

interface SocketContextType {
  socket: SocketType | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const dispatch = useDispatch<AppDispatch>();
  const loggedUser = userInfo?.id || trainerInfo?.id || null;
  const {addTrainerNotification, addUserNotification} = useNotification()


  

   useEffect(() => {
    console.log("Initializing socket connection...");
    if (!loggedUser) {
      console.warn("No loggedUser found, skipping socket initialization.");
      setSocket(null);
      return;
    }

    const newSocket = io("http://localhost:3000", {
      query: { userId: loggedUser },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);
    });

   // Cleanup socket on unmount
    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
      setSocket(null);
    };
  }, [loggedUser]);


  useEffect(() => {
    if (!socket) {
      console.warn("Socket instance is null; skipping event listener setup.");
      return;
    }

    // Incoming Video Call
    socket.on("incoming-video-call", (data: any) => {
      
      if (userInfo?.id===data._id) {
      dispatch(setShowIncomingVideoCall({
        _id: data._id,
        trainerId: data.from,
        callType: data.callType,
        trainerName: data.trainerName,
        trainerImage: data.trainerImage,
        roomId: data.roomId,
      }));
    }
    else if (trainerInfo && trainerInfo.id === data._id) {
      // Trainer received their own call by mistake, ignore
      console.log("Trainer received a call but ignoring it.");
    }
    else{
      console.log("Unrelated socket event received; ignoring.");
    }
    });

    // Accepted Call
    socket.on("accepted-call", (data: any) => {
    
      
      dispatch(setRoomId(data.roomId));
      dispatch(setShowVideoCall(true));

      socket.emit("trainer-call-accept", {
        roomId: data.roomId,
        trainerId: data.from,
        to: data._id,
      });
    
    });

    // Trainer Accept
    socket.on("trainer-accept", (data: any) => {
      dispatch(setRoomId(data.roomId));
      dispatch(setShowVideoCall(true));
    });

    // Call Rejected
    socket.on("call-rejected", () => {
      toast.error("Call ended/rejected");
      dispatch(setVideoCall(null));
      dispatch(endCallTrainer());
      dispatch(endCallUser());
    });

    // User Left
    socket.on("user-left", (data: string | undefined) => {
      
      if (data === userInfo?.id) {
        dispatch(setShowVideoCallUser(false));
        dispatch(setRoomIdUser(null));
        dispatch(setVideoCallUser(null));
        dispatch(setShowIncomingVideoCall(null));
      } else if (data === trainerInfo?.id) {
        dispatch(setShowVideoCall(false));
        dispatch(setRoomId(null));
        dispatch(setVideoCall(null));
      }
    });
    socket.on('receiveNewBooking', (data: string) => {
      addTrainerNotification(data);
    });
    
    socket.on('receiveCancelNotificationForTrainer', (data: string) => {
      addTrainerNotification(data);
    });

    // Cleanup event listeners
    return () => {
      
      socket.off("incoming-video-call");
      socket.off("accepted-call");
      // socket.off("trainer-accept");
      socket.off("call-rejected");
      socket.off("user-left");
      socket.off('receiveCancelNotificationForTrainer')
      socket.off('receiveCancelNotificationForUser')
    };
  }, [socket, dispatch,addUserNotification, addTrainerNotification]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
