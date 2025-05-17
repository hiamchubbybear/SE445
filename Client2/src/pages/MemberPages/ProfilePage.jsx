// ProfilePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

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

  if (!user) return <div className="text-center p-8">Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-[75vh] ">
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              user.avatar && user.avatar.trim() !== ""
                ? user.avatar
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user.username}
            </h2>
            <p className="text-gray-500">{user.email}</p>
            <p
              className={`text-sm mt-1 ${
                user.status === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {user.status === "active" ? "Đang hoạt động" : "Bị khóa"}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Khóa học đã mua</h3>
          {user.purchasedCourses?.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {user.purchasedCourses.map((course, index) => (
                <li key={index}>{course.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Chưa có khóa học nào.</p>
          )}
        </div>

        <div className="mt-6 text-right">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Link to="/member/profile/update">Chỉnh sửa hồ sơ</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
