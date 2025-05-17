import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCourseDialog from "./AddCourseDialog";
import EditCourseDialog from "./EditCourseDialog";
import ManageDocsModal from "./ManageDocsModal";
import TablePagination from "@mui/material/TablePagination";

function ListAllCourses() {
  const [courses, setCourses] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openDocs, setOpenDocs] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/admin/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCourses(res.data.courses);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách khoá học:", err);
      toast.error("❌ Lỗi khi lấy danh sách khoá học.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá khoá học này?")) return;
    try {
      await axios.delete(`http://localhost:8080/v1/admin/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCourses((prev) => prev.filter((course) => course._id !== id));
      toast.success("✅ Xoá khoá học thành công!");
    } catch (err) {
      console.error("Lỗi khi xoá khoá học:", err);
      toast.error("❌ Lỗi khi xoá khoá học.");
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setOpenEdit(true);
  };

  const handleManageDocs = (course) => {
    setSelectedCourse(course);
    setOpenDocs(true);
  };

  const handleCourseAdded = (newCourse) => {
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleCourseUpdated = (updatedCourse) => {
    setCourses((prev) =>
      prev.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
    );
  };

  return (
    <div className="max-h-screen bg-gray-100">
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Danh sách khoá học
        </Typography>
        <div className="flex flex-row">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenAdd(true)}
            sx={{ mb: 2 }}
          >
            Thêm khoá học
          </Button>
          <TablePagination
            sx={{ marginLeft: "auto" }}
            component="div"
            count={courses.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((course, index) => (
                  <TableRow key={course._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell>
                      {course.price === 0
                        ? "Miễn phí"
                        : new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(course.price)}
                    </TableCell>
                    <TableCell>{course.tags?.join(", ")}</TableCell>
                    <TableCell>
                      <img
                        src={course.image}
                        alt={course.title}
                        style={{
                          width: "80px",
                          height: "auto",
                          borderRadius: "6px",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/80x50?text=No+Image";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(course.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        onClick={() => handleManageDocs(course)}
                      >
                        <ArticleIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(course._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialogs */}
      <AddCourseDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCourseAdded={handleCourseAdded}
      />
      <EditCourseDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        course={selectedCourse}
        onUpdated={handleCourseUpdated}
      />
      <ManageDocsModal
        open={openDocs}
        onClose={() => setOpenDocs(false)}
        course={selectedCourse}
      />

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ListAllCourses;
