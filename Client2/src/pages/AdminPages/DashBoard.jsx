import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, Avatar, useTheme } from "@mui/material";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DescriptionIcon from "@mui/icons-material/Description";
import QuizIcon from "@mui/icons-material/Quiz";

const COLORS = ["#00C49F", "#FF8042"];

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={4}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      p: 3,
      borderRadius: 4,
      bgcolor: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    }}
  >
    <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
    <Box>
      <Typography variant="body2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default function AdminDashboard() {
  const theme = useTheme();
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [courseCount, setCourseCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [incomeData, setIncomeData] = useState([
    { month: "Jan", income: 0 },
    { month: "Feb", income: 0 },
    { month: "Mar", income: 0 },
    { month: "Apr", income: 0 },
    { month: "May", income: 0 },
  ]);

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchDocsAndQuizzes();
    fetchIncome();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8080/v1/admin/profiles", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const users = res.data.users;
    const active = users.filter((u) => u.status === "active").length;
    const inactive = users.length - active;
    setUserStats({ total: users.length, active, inactive });
  };

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:8080/v1/admin/courses", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setCourseCount(res.data.courses.length);
  };

  const fetchDocsAndQuizzes = async () => {
    const res = await axios.get(
      "http://localhost:8080/v1/admin/courses/docs/quizzes",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    let docTotal = 0;
    let quizTotal = 0;
    res.data.courses.forEach((course) => {
      docTotal += course.docs.length;
      course.docs.forEach((doc) => (quizTotal += doc.quizzes.length));
    });
    setDocCount(docTotal);
    setQuizCount(quizTotal);
  };

  const fetchIncome = async () => {
    // Mock data - replace with actual API if available
    setIncomeData([
      { month: "Jan", income: 120 },
      { month: "Feb", income: 210 },
      { month: "Mar", income: 160 },
      { month: "Apr", income: 320 },
      { month: "May", income: 290 },
    ]);
  };

  return (
    <Box
      p={4}
      sx={{ backgroundColor: theme.palette.grey[100], minHeight: "100vh" }}
    >
      <Typography variant="h4" fontWeight={700} mb={4}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} justifyContent="center" mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={userStats.total}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Courses"
            value={courseCount}
            icon={<MenuBookIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Documents"
            value={docCount}
            icon={<DescriptionIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Quizzes"
            value={quizCount}
            icon={<QuizIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 4,
              height: 380,
              width: 400,
              bgcolor: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              User Status
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Active", value: userStats.active },
                    { name: "Inactive", value: userStats.inactive },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  <Cell key="cell-0" fill="#00C49F" />
                  <Cell key="cell-1" fill="#FF8042" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 4,
              height: 400,
              width: 600,
              bgcolor: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Monthly Income
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={incomeData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#8884d8"
                  barSize={40}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
