import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useRef } from "react";
import { setRoomIdUser, setShowIncomingVideoCall, setShowVideoCallUser, setVideoCallUser,} from "../../features/user/userSlice";
import { useSocketContext } from "../../context/socket";
import { useNavigate } from "react-router-dom";


function VideoCall() {
  const navigate=useNavigate()
  const videoCallRef = useRef<HTMLDivElement | null>(null);
  const { roomIdUser, showIncomingVideoCall, videoCall } = useSelector(
    (state: RootState) => state.user
  );
  let { socket } = useSocketContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!roomIdUser) return;
    
  }, [roomIdUser]);

  useEffect(() => {
    if (!roomIdUser) return;

    const appId = parseInt(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SECRET;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomIdUser.toString(),
      Date.now().toString(),
      "User"
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
        onLeaveRoom: () => {
          console.log("ClientLeaving room...");
          
          socket?.emit("leave-room", { to: showIncomingVideoCall?._id });
          dispatch(setShowVideoCallUser(false));
          dispatch(setRoomIdUser(null));
          dispatch(setVideoCallUser(null));
          dispatch(setShowIncomingVideoCall(null));
        },
      });
    }

    socket?.on("user-left", () => {
      console.log("trainer left the room");
      zp.destroy();
      dispatch(setShowVideoCallUser(false));
      dispatch(setRoomIdUser(null));
      dispatch(setVideoCallUser(null));
      dispatch(setShowIncomingVideoCall(null));
    });

    return () => {
      // window.location.reload();

      zp.destroy();
    };
  }, [roomIdUser, dispatch, socket]);

  return (
    <div
      className="w-screen bg-black h-screen absolute z-[100]"
      ref={videoCallRef}
    />
  );
}

export default VideoCall;