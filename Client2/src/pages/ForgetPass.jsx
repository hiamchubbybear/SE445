import React, { useState } from "react";
import axios from "axios";
export default function ForgetPass() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await axios.post("http://localhost:8080/v1/forgot", { email });
      setStatus("✅ Đã gửi email khôi phục nếu tài khoản tồn tại.");
    } catch (err) {
      setStatus("❌ Email không tồn tại hoặc lỗi máy chủ.");
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Gửi liên kết đặt lại mật khẩu
          </button>
        </form>
        {status && <p className="text-sm mt-4 text-center">{status}</p>}
      </div>
    </div>
  );
}
