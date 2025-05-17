import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Paper,
  TableContainer,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserManager() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/admin/profiles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data.users);
    } catch (err) {
      toast.error("❌ Lỗi khi tải danh sách người dùng.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    const isActive = user.status === "active";
    const url = `http://localhost:8080/v1/admin/${
      isActive ? "inactive" : "active"
    }`;
    try {
      await axios.post(
        url,
        { id: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? { ...u, status: isActive ? "inactive" : "active" }
            : u
        )
      );

      toast.success(
        `✅ Tài khoản đã được ${isActive ? "vô hiệu hoá" : "kích hoạt"}.`
      );
    } catch (err) {
      toast.error("❌ Thao tác thất bại.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý người dùng
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.status === "active" ? "✅ Hoạt động" : "❌ Đã vô hiệu"}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color={user.status === "active" ? "error" : "success"}
                    onClick={() => toggleStatus(user)}
                  >
                    {user.status === "active" ? "Vô hiệu hoá" : "Kích hoạt"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có người dùng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
}
