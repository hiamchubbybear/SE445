// ✅ File: ManageDocsModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Add, Edit, Delete, Quiz } from "@mui/icons-material";
import axios from "axios";
import ManageQuizzesModal from "./ManageQuizzesModal";
import AddDocDialog from "./AddDocDialog";
import EditDocDialog from "./EditDocDialog";

export default function ManageDocsModal({ open, onClose, course }) {
  const [docs, setDocs] = useState([]);
  const [openQuiz, setOpenQuiz] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [openAddDoc, setOpenAddDoc] = useState(false);
  const [openEditDoc, setOpenEditDoc] = useState(false);

  useEffect(() => {
    if (course?._id) fetchDocs();
  }, [course]);

  const fetchDocs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/v1/admin/courses/${course._id}/docs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDocs(res?.data?.docs || []);
    } catch (err) {
      console.error("Lỗi khi tải tài liệu:", err);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Xoá tài liệu này?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/v1/admin/courses/${course._id}/docs/${docId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchDocs();
    } catch (err) {
      console.error("Lỗi xoá tài liệu:", err);
    }
  };

  const handleDocAdded = (newDoc) => {
    setDocs((prev) => [...prev, newDoc]);
  };

  const handleDocUpdated = (updatedDoc) => {
    setDocs((prev) =>
      prev.map((d) => (d._id === updatedDoc._id ? updatedDoc : d))
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Quản lý tài liệu cho: {course?.title}</DialogTitle>
      <DialogContent>
        <Button
          startIcon={<Add />}
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => setOpenAddDoc(true)}
        >
          Thêm tài liệu
        </Button>

        <List>
          {docs.map((doc) => (
            <ListItem key={doc._id} divider>
              <ListItemText
                primary={doc.title}
                secondary={doc.content?.slice(0, 100) + "..."}
              />
              <ListItemSecondaryAction>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setOpenQuiz(true);
                  }}
                >
                  <Quiz />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setOpenEditDoc(true);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(doc._id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {docs.length === 0 && (
            <Typography color="text.secondary" ml={2}>
              Chưa có tài liệu nào.
            </Typography>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>

      <ManageQuizzesModal
        open={openQuiz}
        onClose={() => setOpenQuiz(false)}
        courseId={course?._id}
        doc={selectedDoc}
      />
      <AddDocDialog
        open={openAddDoc}
        onClose={() => setOpenAddDoc(false)}
        courseId={course?._id}
        onCreated={handleDocAdded}
      />
      <EditDocDialog
        open={openEditDoc}
        onClose={() => setOpenEditDoc(false)}
        courseId={course?._id}
        doc={selectedDoc}
        onUpdated={handleDocUpdated}
      />
    </Dialog>
  );
}
