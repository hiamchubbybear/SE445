import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreatePostModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/v1/posts",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("✅ Tạo bài viết thành công!");
      onCreated(res.data); // gọi callback
      onClose();
      setTitle("");
      setContent("");
    } catch (err) {
      toast.error("❌ Lỗi tạo bài viết.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tạo bài viết mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tiêu đề"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ my: 1 }}
        />
        <TextField
          label="Nội dung"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleSubmit} variant="contained">
          Đăng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
