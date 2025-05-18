import axios from "axios";
import React,{ useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:8080/v1/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const coursesData = res?.data?.courses || [];
      const filtered = coursesData.filter((c) => c.purchased === false);
      setCourses(filtered);
    } catch (err) {
      console.error("Lỗi khi lấy khoá học:", err);
      setError("Không thể tải danh sách khoá học");
      toast.error("Không thể lấy danh sách khoá học.");
    } finally {
      setLoading(false);
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

      console.log("Kết quả thêm:", res.data);
      toast.success("🛒 Đã thêm vào giỏ hàng!");
      if (window.updateCartCount) window.updateCartCount();
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err.response?.data || err);
      toast.error(
        err.response?.data?.message || "❌ Thêm vào giỏ thất bại."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải khoá học...</p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchCourses}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-gray-800 m-4">
        Khoá học hiện có
      </h1>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={course.image || "/placeholder-course.jpg"}
                alt={course.title || "Khóa học"}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-course.jpg";
                }}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {course.title || "Không có tiêu đề"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {course.description || "Không có mô tả"}
                </p>
                <div className="mt-3 text-indigo-600 font-semibold">
                  {course.price === 0
                    ? "Miễn phí"
                    : `${(course.price || 0).toLocaleString()}đ`}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(course.tags || []).map((tag, idx) => (
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
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              Không có khoá học nào khả dụng hoặc bạn đã mua tất cả khoá học rồi 🎉
            </p>
            <button
              onClick={fetchCourses}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Tải lại
            </button>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default CourseList;
