// PostDetail.jsx - Trang hiển thị chi tiết bài viết kèm bình luận
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/v1/posts/${id}`);
      const fullPost = {
        ...res.data.post,
        comments: res.data.comments || [],
      };
      setPost(fullPost);
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/v1/comments",
        {
          postId: id,
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewComment("");
      fetchPost();
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (!post) return <div className="text-center p-8">Đang tải bài viết...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[75vh]">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline text-sm mb-4"
      >
        ← Quay lại
      </button>

      <div className="bg-white shadow p-4 rounded border mb-4 ">
        <div className="flex items-center gap-2 mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="text-sm text-gray-500 font-semibold">
            {post.author?.username || "Ẩn danh"} •{" "}
            {new Date(post.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mt-2 mb-2">
          {post.title}
        </h2>
        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>

      <div className="bg-white p-4 rounded border">
        <h3 className="text-md font-bold text-gray-800 mb-3">Bình luận</h3>

        {Array.isArray(post.comments) && post.comments.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {post.comments.map((cmt) => (
              <li key={cmt._id} className="border p-2 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <p className="text-sm font-semibold text-blue-700">
                    {cmt.userId?.username || "Ẩn danh"}
                  </p>
                </div>
                <p className="text-sm text-gray-700">{cmt.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(cmt.createdAt).toLocaleString("vi-VN")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Chưa có bình luận nào.</p>
        )}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Nhập bình luận..."
            className="flex-1 border px-3 py-2 rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleComment}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
