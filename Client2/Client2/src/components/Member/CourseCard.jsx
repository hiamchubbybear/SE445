import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden w-full max-w-sm">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
        <p className="text-blue-600 font-semibold">
          {course.isFree ? "Miễn phí" : `${course.price.toLocaleString()}đ`}
        </p>
        <span className="text-xs text-white bg-indigo-500 px-2 py-1 rounded">
          {course.level}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
