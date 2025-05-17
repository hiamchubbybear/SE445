import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function ViewPostModal({ open, onClose, post }) {
  const [fullPost, setFullPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post?._id && open) {
      fetchPostWithComments(post._id);
    }
  }, [post, open]);

  const fetchPostWithComments = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/v1/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFullPost({
        ...res.data.post,
        comments: res.data.comments || [],
      });
    } catch (err) {
      console.error("Lỗi tải chi tiết bài viết:", err);
      setFullPost(null);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{fullPost?.title || post.title}</DialogTitle>
      <DialogContent dividers>
        {/* ✅ Thông tin bài viết */}
        {fullPost ? (
          <>
            <Typography variant="subtitle2" color="gray" mb={1}>
              Người đăng: {fullPost.author?.username || "Ẩn danh"}
            </Typography>

            <Typography variant="body1" mb={3}>
              {fullPost.content}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary" mb={3}>
            Đang tải nội dung bài viết...
          </Typography>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* ✅ Bình luận */}
        <Typography variant="h6" gutterBottom>
          Bình luận {loading ? "" : `(${fullPost?.comments?.length || 0})`}
        </Typography>

        <div style={{ minHeight: 120 }}>
          {loading ? (
            <CircularProgress size={24} />
          ) : fullPost?.comments?.length > 0 ? (
            <List>
              {fullPost.comments.map((cmt) => (
                <ListItem key={cmt._id} alignItems="flex-start">
                  <ListItemText
                    primary={`${cmt.userId?.username || "Ẩn danh"} • ${new Date(
                      cmt.createdAt
                    ).toLocaleString("vi-VN")}`}
                    secondary={cmt.content}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              Chưa có bình luận nào.
            </Typography>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
