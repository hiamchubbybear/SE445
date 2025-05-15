import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

export default function AddCourseDialog({ open, onClose, onCourseAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    image: "",
    tags: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const handleAdd = () => setOpenDialog(true);
  const handleCourseAdded = (newCourse) => {
    setCourses((prev) => [...prev, newCourse]);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/v1/admin/courses",
        {
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onCourseAdded(res.data.course); // callback
      onClose();
    } catch (err) {
      console.error("Lỗi khi tạo khóa học:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Thêm khóa học mới</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Tiêu đề"
          name="title"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Mô tả"
          name="description"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Giá"
          name="price"
          type="number"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Ảnh (URL)"
          name="image"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Tags (phân cách bởi dấu phẩy)"
          name="tags"
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
