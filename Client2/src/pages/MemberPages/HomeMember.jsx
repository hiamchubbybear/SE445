import React, { useEffect, useState } from "react";
import coursesData from "../../mocks/progress.json";
export default function HomeMember() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses(coursesData);
    console.log(coursesData); // gán trực tiếp từ import
  }, []);

  const learning = courses.filter((course) => course.status === "Đang học");
  const completed = courses.filter((course) => course.status === "Hoàn thành");

  const CourseCard = ({ course }) => (
    <div className="p-4 border rounded-xl shadow bg-white">
      <h2 className="text-xl font-semibold text-blue-600">{course.title}</h2>
      <p className="text-gray-600 mb-2">{course.description}</p>

      {/* Thanh tiến độ với phần trăm bên trong */}
      <div className="w-full bg-gray-200 rounded-full h-6 relative">
        <div
          className={`h-6 rounded-full text-white text-sm font-medium flex items-center justify-center ${
            course.progress === 100 ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${course.progress}%` }}
        >
          {course.progress}%
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Trạng thái: <span className="capitalize">{course.status}</span>
      </p>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">📘 Khóa Học Đang Học</h1>
        <div className="space-y-4">
          {learning.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">✅ Khóa Học Đã Học Xong</h1>
        <div className="space-y-4">
          {completed.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
