// ✅ File: CourseStudyPage.jsx - Theo cách 1: Hiện từng tài liệu một
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Collapse,
} from "@mui/material";

export default function CourseStudyPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/v1/admin/courses/${courseId}/docs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDocs(res.data.docs || []);
      } catch (err) {
        console.error("Lỗi khi lấy tài liệu:", err);
      }
    };
    fetchDocs();
  }, [courseId]);

  const handleSelect = (quizId, value) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: value }));
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleRetry = () => {
    const newAnswers = { ...selectedAnswers };
    docs[currentIndex].quizzes.forEach((q) => {
      delete newAnswers[q._id];
    });
    setSelectedAnswers(newAnswers);
    setShowResult(false);
  };

  const handleNext = () => {
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const isFinished = currentIndex >= docs.length;
  const doc = docs[currentIndex];

  if (isFinished)
    return (
      <div class="min-h-screen justify-center items-center flex  ">
        {" "}
        <Box textAlign="center" p={4}>
          <Typography variant="h5" gutterBottom>
            🎉 Bạn đã hoàn thành toàn bộ khoá học!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/member")}
          >
            🔙 Về trang chủ
          </Button>
        </Box>
      </div>
    );

  return (
    <div class="min-h-screen">
      <Box maxWidth="900px" mx="auto" p={4}>
        <Typography variant="h4" mb={4}>
          📚 Nội dung khoá học
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {doc.title}
          </Typography>
          <Typography variant="body1" mb={3}>
            {doc.content}
          </Typography>

          {doc.quizzes?.length > 0 && (
            <>
              <Typography variant="h6" mb={2}>
                ❓ Câu hỏi trắc nghiệm
              </Typography>
              <List>
                {doc.quizzes.map((quiz) => (
                  <ListItem key={quiz._id} divider>
                    <Box>
                      <Typography fontWeight="bold" mb={1}>
                        {quiz.question}
                      </Typography>
                      <RadioGroup
                        value={selectedAnswers[quiz._id] || ""}
                        onChange={(e) => handleSelect(quiz._id, e.target.value)}
                      >
                        {quiz.options.map((opt, i) => (
                          <FormControlLabel
                            key={i}
                            value={opt}
                            control={<Radio />}
                            label={opt}
                            disabled={showResult}
                          />
                        ))}
                      </RadioGroup>
                      <Collapse in={showResult}>
                        <Typography
                          sx={{
                            mt: 1,
                            color:
                              selectedAnswers[quiz._id] === quiz.correctAnswer
                                ? "green"
                                : "red",
                          }}
                        >
                          {selectedAnswers[quiz._id] === quiz.correctAnswer
                            ? "✅ Chính xác!"
                            : `❌ Sai. Đáp án đúng: ${quiz.correctAnswer}`}
                        </Typography>
                      </Collapse>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Box mt={3}>
            {!showResult ? (
              <Button variant="contained" onClick={handleSubmit}>
                Nộp bài
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleRetry}
                >
                  🔁 Làm lại
                </Button>
                <Button variant="contained" sx={{ ml: 2 }} onClick={handleNext}>
                  ▶️ Tiếp theo
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}
