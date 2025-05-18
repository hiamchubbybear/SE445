import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function AddDocDialog({ open, onClose, courseId, onCreated }) {
  const [doc, setDoc] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!doc.title || !doc.content) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/v1/admin/courses/${courseId}/docs`,
        doc,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Dữ liệu trả về:", res.data);
      onCreated(res.data.docs.at(-1)); // lấy doc mới nhất
      setDoc({ title: "", content: "" });
      onClose();
    } catch (err) {
      console.error("Lỗi tạo tài liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm tài liệu mới</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Tiêu đề"
          value={doc.title}
          onChange={(e) => setDoc({ ...doc, title: e.target.value })}
          sx={{ my: 2 }}
        />
        <TextField
          fullWidth
          label="Nội dung"
          multiline
          rows={6}
          value={doc.content}
          onChange={(e) => setDoc({ ...doc, content: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
