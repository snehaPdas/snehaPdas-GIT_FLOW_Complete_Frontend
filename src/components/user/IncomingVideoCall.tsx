import React from 'react'
import { AppDispatch, RootState } from '../../app/store'
import { useDispatch } from 'react-redux'
import { useSocketContext } from '../../context/socket'
import { useSelector } from 'react-redux'
import { MdCallEnd } from "react-icons/md"
import { endCallUser, setRoomIdUser, setShowVideoCallUser } from '../../features/user/userSlice'



function IncomingVideoCall() {
    const {showIncomingVideoCall,userInfo } = useSelector((state: RootState) => state.user)
    const { trainerInfo } = useSelector((state: RootState) => state.trainer);

    const dispatch = useDispatch<AppDispatch>()
    const {socket} = useSocketContext()

    // if (trainerInfo) {
    //     return null;
    //   }

    const handleEndCall = async () => {
    
      
        if (!showIncomingVideoCall) {
          console.error("No incoming call to end.");
          return;
        }
      
        await socket?.emit("reject-call", {            
          to: showIncomingVideoCall._id,
          sender: "user",
          name: showIncomingVideoCall.trainerName,
        });
        dispatch(endCallUser());
    }

    const handleAcceptCall = async () => {
        if(!showIncomingVideoCall){
            return
        }
        socket?.emit("accept-incoming-call",{
            to:showIncomingVideoCall._id,
            from:showIncomingVideoCall.trainerId,
            roomId: showIncomingVideoCall.roomId,

        })
        dispatch(setRoomIdUser(showIncomingVideoCall.roomId));
        dispatch(setShowVideoCallUser(true));
    }

  return (
    <>
    <div className='w-full h-full flex justify-center items-center z-40 fixed top-1'>
        <div className='w-96 bg-[#311b2e]  z-40 rounded-xl flex flex-col items-center shadow-2xl shadow-black'>
            <div className='flex flex-col gap-7 items-center'>
                <span className='text-lg text-white  mt-4'>
                    {'Incoming video call'}
                </span>
                <span className='text-3xl text-white font-bold'>{showIncomingVideoCall?.trainerName}</span>

            </div>
            <div className='flex m-5'>
                <img className='w-24 h-24 rounded-full' src={showIncomingVideoCall?.trainerImage} alt='profile' />
            </div>
            <div className='flex m-2  mb-5 gap-7'>

                <div className='bg-green-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-1 cursor-pointer'>
                    <MdCallEnd onClick={handleAcceptCall} className='text-3xl' />

                </div>
                <div className='bg-red-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-1 cursor-pointer'>
                    <MdCallEnd onClick={handleEndCall} className='text-3xl' />

                </div>
            </div>
        </div>
    </div>
</>
  )
}

export default IncomingVideoCall
