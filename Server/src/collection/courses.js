const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const DocSchema = new mongoose.Schema({
  title: String,
  content: String,
  quizzes: [QuizSchema],
});

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: Number,
    thumbnail: String,
    docs: [DocSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
