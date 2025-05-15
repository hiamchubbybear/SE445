import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../Layouts/Footer";
import HeaderMember from "../../components/Member/HeaderMember";

export default function MainMember() {
  return (
    <div>
      <HeaderMember />
      <Outlet />
      <Footer />
    </div>
  );
}
