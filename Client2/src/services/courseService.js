import courses from "../mocks/courses.json";

export const getCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(courses), 300); // Giả delay call API
  });
};
