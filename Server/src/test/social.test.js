const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { Post, Comment } = require("../collection/social"); // import model thật
const routes = require("../routes/web.js"); // route mình viết phía trên

const app = express();
app.use(express.json());

// Mock middleware auth giả lập
app.use((req, res, next) => {
  // Giả sử req.user = user role user hoặc admin
  req.user = { id: "644c6fceef0a5e14c2e78b44", role: "user" };
  next();
});

app.use(routes);

describe("Test Post and Comment API", () => {
  // Connect DB trước test
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/se445", { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // Clean DB sau mỗi test
  afterEach(async () => {
    await Post.deleteMany({});
    await Comment.deleteMany({});
  });

  // Ngắt kết nối DB sau cùng
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Create Post", async () => {
    const res = await request(app).post("/posts").send({
      title: "Test Post",
      content: "This is content",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Post");
    expect(res.body.content).toBe("This is content");
    expect(res.body.author).toBe("644c6fceef0a5e14c2e78b44");
  });

  test("Update Post by author/admin", async () => {
    // Tạo post trước
    let post = new Post({ title: "Old Title", content: "Old content", author: "644c6fceef0a5e14c2e78b44" });
    await post.save();

    const res = await request(app).put(`/posts/${post._id}`).send({
      title: "New Title",
      content: "New Content",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Title");
    expect(res.body.content).toBe("New Content");
  });

  test("Delete Post by author/admin", async () => {
    let post = new Post({ title: "Delete Title", content: "Delete content", author: "644c6fceef0a5e14c2e78b44" });
    await post.save();

    const res = await request(app).delete(`/posts/${post._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post deleted");
  });

  test("Add comment", async () => {
    let post = new Post({ title: "Post for comment", content: "Content", author: "644c6fceef0a5e14c2e78b44" });
    await post.save();

    const res = await request(app).post("/comments").send({
      postId: post._id,
      content: "This is a comment",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe("This is a comment");
    expect(res.body.postId).toBe(post._id.toString());
    expect(res.body.userId).toBe("644c6fceef0a5e14c2e78b44");
  });

  test("Delete comment by owner", async () => {
    let post = new Post({ title: "Post", content: "Content", author: "644c6fceef0a5e14c2e78b44" });
    await post.save();

    let comment = new Comment({ postId: post._id, userId: "644c6fceef0a5e14c2e78b44", content: "Comment to delete" });
    await comment.save();

    const res = await request(app).delete(`/comments/${comment._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Comment deleted");
  });

  test("Delete comment forbidden if not owner or admin", async () => {
    // Thay đổi middleware để role user khác và id khác
    app.use((req, res, next) => {
      req.user = { id: "someOtherUserId", role: "user" };
      next();
    });

    let post = new Post({ title: "Post", content: "Content", author: "644c6fceef0a5e14c2e78b44" });
    await post.save();

    let comment = new Comment({ postId: post._id, userId: "644c6fceef0a5e14c2e78b44", content: "Comment" });
    await comment.save();

    const res = await request(app).delete(`/comments/${comment._id}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });
});
