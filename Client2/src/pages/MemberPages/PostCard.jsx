// PostCard.jsx - hiển thị một bài viết và phần bình luận
import React, { useState } from "react";
import CommentSection from "./CommentSection";
import moment from "moment";

export default function PostCard({ post, fetchPosts }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div className="flex items-center mb-2">
        <img
          src="https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/avatar-mac-dinh-02-1724861799.jpg"
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {post.author?.username || "Người dùng"}
          </p>
          <p className="text-xs text-gray-500">
            {moment(post.createdAt).format("HH:mm DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h2>
      <p className="text-gray-700 mb-2 whitespace-pre-line">{post.content}</p>

      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="text-sm text-blue-600 hover:underline"
      >
        {showComments
          ? "Ẩn bình luận"
          : `Xem bình luận (${post.commentCount || 0})`}
      </button>

      {showComments && (
        <CommentSection postId={post._id} fetchPosts={fetchPosts} />
      )}
    </div>
  );
}
