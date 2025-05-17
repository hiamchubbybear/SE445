import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UpdateProfile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Lấy dữ liệu ban đầu từ /v1/profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/v1", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setForm({
          username: res.data.username,
          email: res.data.email,
          password: "", // Không show mật khẩu
        });
      } catch (err) {
        console.error("Lỗi khi tải profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:8080/v1/profile",
        {
          username: form.username,
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("✅ Hồ sơ đã được cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setMessage("❌ Có lỗi xảy ra khi cập nhật hồ sơ.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cập nhật hồ sơ</h1>
      <Link to="/member/profile">
        <button className="mb-4 text-blue-600 hover:underline">
          ← Quay lại trang cá nhân
        </button>
      </Link>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow border space-y-4"
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Tên người dùng
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mật khẩu mới
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Để trống nếu không đổi"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Cập nhật hồ sơ
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-green-600">
          {message}
        </p>
      )}
    </div>
  );
}
