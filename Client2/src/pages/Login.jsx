import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/v1/login", {
        username: email,
        password,
      });

      const token = res.data.data.jwtToken;
      localStorage.setItem("token", token);
      localStorage.setItem("username", email);

      setLoading(false);
      if (email.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/member");
      }
    } catch (err) {
      setLoading(false);
      setError("Tài khoản hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Đăng nhập</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="font-medium text-sm">Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập username"
              className="w-full mt-1 border rounded-md px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-medium text-sm">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full border rounded-md px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Quên mật khẩu?
          </Link>
        </p>

        <p className="text-center text-sm mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
        <p className="text-center text-sm ">
          <Link to="/" className="text-blue-600 hover:underline">
            Quay về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}
