import React from "react";
import SideBar from "../../components/Admin/SideBar";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 bg-gray-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
