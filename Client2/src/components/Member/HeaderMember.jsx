import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";

const HeaderMember = () => {
  const [username, setUsername] = useState("Người dùng");
  const [openMenu, setOpenMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const menuRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, []);
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Lỗi khi tải profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchCartCount = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Giỏ hàng:", res.data);
      setCartCount(res.data.cart?.courses?.length || 0);
    } catch (err) {
      console.error("Không thể lấy giỏ hàng:", err.response?.data || err);
    }
  };
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-4xl font-bold text-blue-600 flex items-center justify-center">
          MyCourses
        </div>

        {/* Menu */}
        <nav className="space-x-4 text-sm font-medium flex items-center">
          <Link
            to="/member"
            className={`p-3 rounded-md font-bold transition ${
              isActive("/member")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-200 hover:text-blue-600"
            }`}
          >
            Trang chủ
          </Link>

          <Link
            to="/member/courses"
            className={`p-3 rounded-md font-bold transition ${
              isActive("/member/courses")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-200 hover:text-blue-600"
            }`}
          >
            Khoá học
          </Link>

          <Link
            to="/member/discussions"
            className={`p-3 rounded-md font-bold transition ${
              isActive("/member/discussions")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-200 hover:text-blue-600"
            }`}
          >
            Thảo luận
          </Link>
        </nav>

        {/* Giỏ hàng + Avatar */}
        <div className="flex items-center gap-6">
          {/* Giỏ hàng */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/member/cart")}
          >
            <FaShoppingCart className="text-xl text-gray-700 hover:text-blue-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </div>

          {/* Avatar */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="flex items-center space-x-2"
            >
              <img
                src={
                  user?.avatar?.trim()
                    ? user.avatar
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
              <span className="text-sm font-medium text-gray-800">
                {user?.username || "Người dùng"}
              </span>
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-10">
                <Link
                  to="/member/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={() => {
                    localStorage.clear();
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
      </div>
    </header>
  );
};

export default HeaderMember;
