import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useRef } from "react";
import {
  endCallTrainer,
  setDietPLan,
  setRoomId,
  setShowVideoCall,
  setVideoCall,
} from "../../features/trainer/TrainerSlice";
import { useSocketContext } from "../../context/socket";
import { useNavigate } from "react-router-dom";

function TrainerVideoCall() {
  const navigate=useNavigate()
  const videoCallRef = useRef<HTMLDivElement | null>(null);
  const { roomIdTrainer, videoCall } = useSelector(
    (state: RootState) => state.trainer
  );

  const dispatch = useDispatch();
  let { socket } = useSocketContext();

  useEffect(() => {
    if (!roomIdTrainer) return;

    const appId = parseInt(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SECRET;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomIdTrainer.toString(),
      Date.now().toString(),
      "Trainer"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    if (videoCallRef.current) {
      zp.joinRoom({
        container: videoCallRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showPreJoinView: false,
        onUserJoin: (users) => {
          users.forEach((user) => {
            console.log("User joined the room:", user);
          });
        },
        onLeaveRoom: () => {
          console.log("Trainer Leaving room...");

          socket?.emit("leave-room", { to: videoCall?.userID });

          // // Reset state on leave
          // dispatch(setShowVideoCall(false));
          // dispatch(setRoomId(null));
          // dispatch(setVideoCall(null));
          dispatch(endCallTrainer());
        },
      });
    }

    // Handle user-left event from the server
    socket?.on("user-left", () => {
      console.log("User left the room.");
      zp.destroy();
      dispatch(setShowVideoCall(false));
      dispatch(setRoomId(null));
      dispatch(setVideoCall(null));
    });

    return () => {
      zp.destroy();
      socket?.off("user-left");
    };
  }, [roomIdTrainer, dispatch, socket]);

  return (
    <div
      className="w-screen bg-black h-screen absolute z-[100]"
      ref={videoCallRef}
    />
  );
}

export default TrainerVideoCall;
