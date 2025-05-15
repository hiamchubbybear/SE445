import React, { useEffect, useState } from "react";

import CourseCard from "../../components/Member/CourseCard";
import { getCourses } from "../../services/courseService";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-gray-800 m-4">
        Danh sách khóa học các khoá học hiện có
      </h1>
      <div className="max-w-7xl  mx-auto p-4 grid grid-rows-2 sm:grid-cols-2 lg:grid-cols-2  gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
