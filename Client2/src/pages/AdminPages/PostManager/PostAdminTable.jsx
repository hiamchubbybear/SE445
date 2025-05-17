import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Paper,
  TableContainer,
  Button,
} from "@mui/material";
import { Visibility, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatePostModal from "./CreatePostModal";
import ViewPostModal from "./ViewPostModal";

export default function PostAdminTable() {
  const [posts, setPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
      toast.error("❌ Lỗi khi tải danh sách bài viết.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bài viết này?")) return;
    try {
      await axios.delete(`http://localhost:8080/v1/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("✅ Xoá bài viết thành công!");
    } catch (err) {
      console.error("Lỗi xoá bài viết:", err);
      toast.error("❌ Xoá bài viết thất bại.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý bài viết
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => setShowCreate(true)}
      >
        Tạo bài viết
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Người đăng</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Bình luận</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post, index) => (
              <TableRow key={post._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author?.username || "Ẩn danh"}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell>{post.commentCount || 0}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedPost(post);
                      setShowView(true);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(post._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có bài viết nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal thêm và xem bài viết */}
      <CreatePostModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(newPost) => setPosts((prev) => [...prev, newPost])}
      />
      <ViewPostModal
        open={showView}
        onClose={() => setShowView(false)}
        post={selectedPost}
      />

      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
}
