import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import axios from "axios";

export default function ManageQuizzesModal({ open, onClose, courseId, doc }) {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    question: "",
    options: [""],
    correctAnswer: "",
  });
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doc?._id && open) fetchQuizzes();
  }, [doc, open]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/v1/admin/courses/${courseId}/docs/${doc._id}/quizzes`
      );
      setQuizzes(res?.data?.quizzes || []);
      console.log("📥 Quiz nhận được:", res.data);
    } catch (err) {
      console.error("Lỗi tải quiz:", err);
    }
  };

  const handleAddQuiz = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/v1/admin/courses/${courseId}/docs/${doc._id}/quizzes`,
        newQuiz,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewQuiz({ question: "", options: [""], correctAnswer: "" });
      fetchQuizzes();
      console.log("Thêm quiz thành công:", res.data);
    } catch (err) {
      console.error("Lỗi thêm quiz:", err);
    }
  };
  const handleUpdateQuiz = async (quiz) => {
    try {
      await axios.put(
        `http://localhost:8080/v1/admin/courses/${courseId}/docs/${doc._id}/quizzes/${quiz._id}`,
        quiz,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      console.error("Lỗi cập nhật quiz:", err);
    }
  };
  const handleDelete = async (quizId) => {
    if (!window.confirm("Xoá câu hỏi này?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/v1/admin/courses/${courseId}/docs/${doc._id}/quizzes/${quizId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchQuizzes();
    } catch (err) {
      console.error("Lỗi xoá quiz:", err);
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...newQuiz.options];
    updated[index] = value;
    setNewQuiz((prev) => ({ ...prev, options: updated }));
  };

  const addOptionField = () => {
    setNewQuiz((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Quản lý Quiz cho: {doc?.title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" mt={2}>
          Thêm câu hỏi mới
        </Typography>
        <TextField
          fullWidth
          label="Câu hỏi"
          value={newQuiz.question}
          onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
          sx={{ mt: 1, mb: 2 }}
        />
        {newQuiz.options.map((opt, i) => (
          <TextField
            key={i}
            fullWidth
            label={`Đáp án ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            sx={{ mb: 1 }}
          />
        ))}
        <TextField
          fullWidth
          label="Đáp án đúng"
          value={newQuiz.correctAnswer}
          onChange={(e) =>
            setNewQuiz({ ...newQuiz, correctAnswer: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <Button variant="outlined" onClick={addOptionField} sx={{ mr: 2 }}>
          + Thêm đáp án
        </Button>
        <Button variant="contained" onClick={handleAddQuiz}>
          Thêm câu hỏi
        </Button>

        <Typography variant="h6" mt={4} mb={2}>
          Danh sách câu hỏi
        </Typography>
        {editingQuiz && (
          <>
            <Typography variant="subtitle1" mt={4}>
              ✏️ Chỉnh sửa câu hỏi
            </Typography>
            <TextField
              fullWidth
              label="Câu hỏi"
              value={editingQuiz.question}
              onChange={(e) =>
                setEditingQuiz((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
              sx={{ mt: 1, mb: 2 }}
            />
            {editingQuiz.options.map((opt, i) => (
              <TextField
                key={i}
                fullWidth
                label={`Đáp án ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...editingQuiz.options];
                  updated[i] = e.target.value;
                  setEditingQuiz((prev) => ({ ...prev, options: updated }));
                }}
                sx={{ mb: 1 }}
              />
            ))}
            <TextField
              fullWidth
              label="Đáp án đúng"
              value={editingQuiz.correctAnswer}
              onChange={(e) =>
                setEditingQuiz((prev) => ({
                  ...prev,
                  correctAnswer: e.target.value,
                }))
              }
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() => handleUpdateQuiz(editingQuiz)}
              sx={{ mr: 2 }}
            >
              Lưu chỉnh sửa
            </Button>
            <Button onClick={() => setEditingQuiz(null)}>Huỷ</Button>
          </>
        )}
        <List>
          {quizzes.map((quiz) => (
            <ListItem key={quiz._id} divider>
              <ListItemText
                primary={quiz.question}
                secondary={`Đáp án đúng: ${quiz.correctAnswer}`}
              />
              <IconButton color="primary" onClick={() => setEditingQuiz(quiz)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(quiz._id)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
          {quizzes.length === 0 && (
            <Typography variant="body2" color="text.secondary" ml={2}>
              Chưa có câu hỏi nào.
            </Typography>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
