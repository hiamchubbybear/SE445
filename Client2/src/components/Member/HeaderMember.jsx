import React, { useEffect, useRef, useState } from "react";

const HeaderMember = () => {
  const [username, setUsername] = useState("Người dùng");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Tự đóng menu khi click ra ngoài
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-4xl font-bold text-blue-600 flex items-center justify-center">
          MyCourses
        </div>

        {/* Menu */}
        <nav className="space-x-6 text-gray-700 text-sm font-medium">
          <a
            href="/member"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Trang chủ
          </a>
          <a
            href="/member/courses"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Khóa học
          </a>
          <a
            href="#"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Tài liệu
          </a>
          <a
            href="#"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Thảo luận
          </a>
          <a
            href="#"
            className="hover:bg-gray-200 hover:text-blue-600 p-4 rounded-md transition duration-300 font-bold"
          >
            Thanh toán
          </a>
        </nav>

        {/* Avatar */}
        {/* Avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className="flex items-center space-x-2"
          >
            <img
              src="https://i.pravatar.cc/42"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-800">
              {username}
            </span>
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-10">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Thông tin cá nhân
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  window.location.href = "/login";
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderMember;
