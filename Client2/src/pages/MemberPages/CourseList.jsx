import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const filtered = res.data.courses.filter((c) => c.purchased === false);
      setCourses(filtered);
    } catch (err) {
      console.error("Lỗi khi lấy khoá học:", err);
      toast.error("Không thể lấy danh sách khoá học.");
    }
  };

  const handleAddToCart = async (courseId) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/v1/cart/add",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Kết quả thêm:", res.data); // <== THÊM DÒNG NÀY
      toast.success("🛒 Đã thêm vào giỏ hàng!");
      if (window.updateCartCount) window.updateCartCount(); // gọi lại header
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err.response?.data || err);
      toast.error("❌ Thêm vào giỏ thất bại.");
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-gray-800 m-4">
        Khoá học hiện có
      </h1>
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{course.description}</p>
              <div className="mt-3 text-indigo-600 font-semibold">
                {course.price === 0
                  ? "Miễn phí"
                  : `${course.price.toLocaleString()}đ`}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {course.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => handleAddToCart(course._id)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Bạn đã mua tất cả khoá học rồi 🎉
          </p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default CourseList;
