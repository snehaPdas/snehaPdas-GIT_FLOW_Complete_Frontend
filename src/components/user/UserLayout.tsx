import React from "react";
import { Outlet } from "react-router-dom";
import UserProfileSideBar from "../user/UserProfileSidebar";
import Header from "./Header";

function UserLayout() {
  return (
    <div className="h-screen flex flex-col">
      {/* Full-Width Header */}
      <Header />

      {/* Main Content: Sidebar + Page Content */}
      <div className="flex flex-1 bg-blue-50">
        {/* Sidebar - Fixed Width */}
        <div className="w-64 flex-shrink-0 bg-white shadow-lg">
          
          <UserProfileSideBar />
        </div>

        {/* Page Content - Takes Remaining Space */}
        <div className="flex-1 p-4 overflow-y-auto bg-blue-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
