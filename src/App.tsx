import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import TrainerRoute from "./routes/TrainerRoute";
import AdminRoute from "./routes/AdminRoute";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import OutgoingVideocallPage from "./pages/trainer/OutgoingvideocallPage";
import VideCallPageTrainer from "./pages/trainer/VideCallPageTrainer";
import IncomingVideoCallPage from "./pages/user/IncomingVideoCallPage";
import VideoCallPage from "./pages/user/VideoCallPage";

import toast, { Toaster } from "react-hot-toast";

function App() {
  const { videoCall, showVideoCallTrainer } = useSelector(
    (state: RootState) => state.trainer
  );
  const { showIncomingVideoCall, showVideoCallUser } = useSelector(
    (state: RootState) => state.user
  );

  console.log("showIncomingVideoCall", showIncomingVideoCall);
  console.log("showVideoCallUser", showVideoCallUser);

  console.log("showVideoCallTrainer", showVideoCallTrainer);
  console.log("videoCall", videoCall);

  return (
    <Router>
      {videoCall && !showVideoCallTrainer && <OutgoingVideocallPage />}
      {showIncomingVideoCall?._id && <IncomingVideoCallPage />}

      {/* {showVideoCallTrainer && }   */}
      {showVideoCallTrainer && <VideCallPageTrainer />}
      {showVideoCallUser && <VideoCallPage />}

      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/trainer/*" element={<TrainerRoute />} />
        <Route path="/admin/*" element={<AdminRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
