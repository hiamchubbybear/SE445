import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function PurchaseHistoryAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8080/v1/admin/purchase-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const histories = res.data.histories;

        const data = histories.map((history, index) => ({
          id: index + 1,
          username: history.userId.username,
          email: history.userId.email,
          courseTitles: history.courses.map((c) => c.title).join(", "),
          courseImages: history.courses.map((c) => c.image),
          totalPrice: history.totalPrice.toLocaleString(),
          createdAt: new Date(history.createdAt).toLocaleString(),
        }));

        setRows(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const columns = [
    { field: "id", headerName: "STT", width: 70 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "courseTitles",
      headerName: "Khoá học đã mua",
      width: 300,
    },
    {
      field: "totalPrice",
      headerName: "Tổng tiền (VND)",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Ngày mua",
      width: 180,
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lịch sử mua khoá học (Admin)
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
    </Box>
  );
}
