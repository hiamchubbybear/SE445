import React from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import UserManager from "../AdminPages/User/UserManager";
import PostAdminTable from "../AdminPages/PostManager/PostAdminTable";
import ListAllCourses from "../AdminPages/Courses/ListAllCourses";

export default function DashBoard() {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="bg-white shadow-md sticky top-0 z-10">
        <Typography
          variant="h4"
          className="p-4 font-bold text-center text-blue-600"
        >
          🎓 Admin Dashboard
        </Typography>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="👥 Người dùng" />
          <Tab label="📝 Bài viết" />
          <Tab label="📚 Khoá học" />
        </Tabs>
      </Box>

      <Box className="p-6">
        {tab === 0 && <UserManager />}
        {tab === 1 && <PostAdminTable />}
        {tab === 2 && <ListAllCourses />}
      </Box>
    </Box>
  );
}
