import React from "react";
import ScrollTop from "../components/ScrollTop";
import MainLayout from "../Layouts/MainLayout";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import MainMember from "../pages/MemberPages/MainMember";
import HomeMember from "../pages/MemberPages/HomeMember";
import CourseList from "../pages/MemberPages/CourseList";
import ForgetPass from "../pages/ForgetPass";
import DashBoard from "../pages/AdminPages/DashBoard";
import AdminPage from "../pages/AdminPages/AdminPage";
import ListAllCourses from "../pages/AdminPages/Courses/ListAllCourses";
export default function MainRoutes() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/forgot-password" element={<ForgetPass />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/member" element={<MainMember />}>
          <Route index element={<HomeMember />} />
          <Route path="/member/courses" element={<CourseList />} />
        </Route>
        <Route path="/admin" element={<AdminPage />}>
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/courses" element={<ListAllCourses />} />
        </Route>
      </Routes>
    </>
  );
}
