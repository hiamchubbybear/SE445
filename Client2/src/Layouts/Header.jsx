import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const user = {
    name: "Thoại",
    avatarUrl: "https://i.pravatar.cc/40?img=3",
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-4xl font-bold text-blue-600 flex items-center justify-center"
        >
          Coursera
        </Link>

        {/* Navigation */}
        <nav className="text-gray-700 font-medium grid grid-cols-4 gap-2 m-2 text-center">
          <a
            href="#hero"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Home
          </a>
          <a
            href="#featured-courses"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Khóa học
          </a>
          <a
            href="#why-choose-us"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Vì sao chọn
          </a>
          <a
            href="#footer"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Liên hệ
          </a>
        </nav>

        {/* Join Now / User Info */}
        <div className="flex flex-row justify-around items-center gap-4">
          <div className="text-blue-600 font-bold cursor-pointer hover:underline">
            <Link to="/login">Đăng nhập</Link>
          </div>
          <div>
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition font-bold "
              >
                Tham gia miễn phí
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
