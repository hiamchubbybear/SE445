import React from "react";
import SideBar from "../../components/Admin/SideBar";

const AdminPage = ({ children }) => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">{children}</div>
    </div>
  );
};

export default AdminPage;
