const { Post, Comment } = require("../collection/social");
const mongoose = require("mongoose");
const connectToDatabase = require("../config/connectToDatabase.js");
const User = require("../collection/users.js");
const CONNECTION_STRING = process.env.MONGODB_URI;
const createPost = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.id;

  try {
    await connectToDatabase(CONNECTION_STRING);
    const post = new Post({ title, content, author });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const post = await Post.findById(id);
    await connectToDatabase(CONNECTION_STRING);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    await connectToDatabase(CONNECTION_STRING);
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Comment.deleteMany({ postId: post._id });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid postId" });
  }
  try {
    await connectToDatabase(CONNECTION_STRING);
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({ postId, userId, content });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    await connectToDatabase(CONNECTION_STRING);
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (userRole !== "admin" && comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostWithComments = async (req, res) => {
  const { id } = req.params;

  try {
    await connectToDatabase(CONNECTION_STRING);
    const post = await Post.findById(id).populate("author", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ postId: id })
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    await connectToDatabase(CONNECTION_STRING);
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username email")
      .lean();
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ postId: post._id });
        return { ...post, commentCount };
      })
    );

    res.json(postsWithCommentCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  getPostWithComments,
  getAllPosts,
};
