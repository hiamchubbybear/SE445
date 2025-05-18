// ForumPage.jsx - Trang danh sách bài viết
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/posts");
      const safeData = Array.isArray(res.data.posts)
        ? res.data.posts
        : Array.isArray(res.data)
        ? res.data
        : [];
      setPosts(safeData);
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Diễn đàn trao đổi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tạo bài viết
        </button>
      </div>

      {Array.isArray(posts) && posts.length === 0 ? (
        <p className="text-gray-500">Chưa có bài viết nào.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md p-4 mb-6 border cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/member/discussions/${post._id}`)}
          >
            <div className="mb-2 flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="avatar"
                className="w-6 h-6 rounded-full object-cover"
              />
              <p className="text-sm text-gray-500 font-semibold">
                {post.author?.username || "Ẩn danh"} •{" "}
                {new Date(post.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="mb-3">
              <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
              <p className="text-gray-700 mt-1 line-clamp-2">{post.content}</p>
              <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-sm text-blue-600 mt-2 font-medium ">
                  {post.commentCount} bình luận
                </p>
                <p className="text-sm text-gray-500 mt-1 ">Xem chi tiết</p>
              </div>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          fetchPosts={fetchPosts}
        />
      )}
    </div>
  );
}
