import React from "react";
import { Link, useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Quản lý tài khoản", path: "/admin/users" },
    { label: "Quản lý tin tức", path: "/admin/discussions" },
    { label: "Quản lý khoá học", path: "/admin/courses" },
    { label: "Quản lý thanh toán", path: "/admin/purchases" },
    { label: "Báo cáo thống kê", path: "/admin/dashboard" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col justify-between p-4">
      {/* Menu */}
      <div>
        <h2 className="text-xl font-bold mb-2 border-b-2 p-4 text-center">
          Admin Cousera
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Đăng xuất */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
      >
        Đăng xuất
      </button>
    </div>
  );
}

export default SideBar;
