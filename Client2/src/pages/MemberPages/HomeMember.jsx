import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HomeMember() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const purchasedCourses = res.data.courses.filter(
        (c) => c.purchased === true
      );
      setCourses(purchasedCourses);
    } catch (err) {
      console.error("Lỗi khi lấy khoá học đã mua:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen ">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Khoá học của tôi
      </h1>
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
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
              <div className="mt-4 text-center">
                <Link
                  to={`/member/courses/${course._id}/study`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  ▶️ Vào học
                </Link>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Bạn chưa mua khoá học nào.
          </p>
        )}
      </div>
    </div>
  );
}
