import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function EditDocDialog({
  open,
  onClose,
  courseId,
  doc,
  onUpdated,
}) {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doc) {
      setFormData({ title: doc.title || "", content: doc.content || "" });
    }
  }, [doc]);

  const handleUpdate = async () => {
    if (!formData.title || !formData.content) return;
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:8080/v1/admin/courses/${courseId}/docs/${doc._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onUpdated(res.data.updatedDoc);
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật tài liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Tiêu đề"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          sx={{ my: 2 }}
        />
        <TextField
          fullWidth
          label="Nội dung"
          multiline
          rows={6}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button variant="contained" onClick={handleUpdate} disabled={loading}>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}
