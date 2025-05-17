import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditCourseDialog({ open, onClose, course, onUpdated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    image: "",
    tags: "",
  });

  useEffect(() => {
    if (course) {
      setForm({
        ...course,
        tags: course.tags?.join(", ") || "",
      });
    }
  }, [course]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/v1/admin/courses/${course._id}`,
        {
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("✅ Cập nhật khoá học thành công!");
      onUpdated(res.data.course);
      onClose();
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật khoá học.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Chỉnh sửa khoá học</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Tiêu đề"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          label="Mô tả"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          label="Giá"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />
        <TextField
          label="Ảnh (URL)"
          name="image"
          value={form.image}
          onChange={handleChange}
        />
        <TextField
          label="Tags (phân cách bởi dấu phẩy)"
          name="tags"
          value={form.tags}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button variant="contained" onClick={handleUpdate}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
