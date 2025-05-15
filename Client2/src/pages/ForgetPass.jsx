import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgetPass() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3); // 3 giây đếm ngược
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/v1/forgot-password", { email });
      setStatus("✅ Đã gửi email khôi phục nếu tài khoản tồn tại.");
      setCountdown(3); // bắt đầu đếm ngược

      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            navigate("/login");
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setStatus("❌ Email không tồn tại hoặc có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white max-w-md w-full p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Quên mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
          </button>
        </form>

        {/* Status */}
        {status && (
          <p className="text-sm mt-4 text-center text-gray-700">
            {status}
            {countdown > 0 && (
              <span>
                {" "}
                Bạn sẽ được chuyển về trang đăng nhập sau {countdown} giây...
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
