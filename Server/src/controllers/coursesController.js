const mongoose = require("mongoose");
const Course = require("../collection/courses.js");
const { ErrorMessage } = require("../dto/errorHandleDTO.js");
const User = require("../collection/users.js");
const CONNECTION_STRING =
  process.env.MONGODB_URI || "mongodb://localhost:27017/se445";

const getCourses = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    const status = 500;
    const data = { message: error.message };
    const errorMsg = new ErrorMessage(status, data);
    res.status(status).send(errorMsg);
  }
};

const createCourse = async (req, res) => {
  const { title, description, price, image, tags } = req.body;

  if (!title || price == null) {
    const status = 400;
    const data = { message: "Missing title or price" };
    const errorMsg = new ErrorMessage(status, data);
    return res.status(400).send(errorMsg);
  }

  try {
    await mongoose.connect(CONNECTION_STRING);
    const course = new Course({ title, description, price, image, tags });
    await course.save();
    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    const status = 500;
    const data = { message: error.message };
    const errorMsg = new ErrorMessage(status, data);
    res.status(status).send(errorMsg);
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, image, tags } = req.body;

  try {
    await mongoose.connect(CONNECTION_STRING);
    const course = await Course.findByIdAndUpdate(
      id,
      { title, description, price, image, tags },
      { new: true }
    );

    if (!course) {
      const status = 404;
      const data = { message: "Course not found" };
      const errorMsg = new ErrorMessage(status, data);
      return res.status(404).send(errorMsg);
    }

    res.status(200).json({ message: "Course updated", course });
  } catch (error) {
    const status = 500;
    const data = { message: error.message };
    const errorMsg = new ErrorMessage(status, data);
    res.status(status).send(errorMsg);
  }
};
const userGetCourses = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);

    const userId = req.user?.id;
    const courses = await Course.find();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: { message: "User not found" },
      });
    }
    const purchasedIds = (user.purchasedCourses || []).map((id) =>
      id.toString()
    );
    console.log("purchasedCourses from DB: ", user.purchasedCourses);
    console.log(
      "All course ids: ",
      courses.map((c) => c._id.toString())
    );

    const result = courses.map((course) => {
      const isPurchased = purchasedIds.includes(course._id.toString());
      return {
        ...course.toObject(),
        purchased: isPurchased,
      };
    });

    const purchasedCourses = result.filter((course) => course.purchased);
    const notPurchasedCourses = result.filter((course) => !course.purchased);
    const sortedCourses = [...purchasedCourses, ...notPurchasedCourses];

    res.status(200).json({ courses: sortedCourses });
  } catch (error) {
    const status = 500;
    const data = { message: error.message };
    const errorMsg = new ErrorMessage(status, data);
    res.status(status).send(errorMsg);
  }
};

const deleteCourse = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    const userRole = req.user.role;
    if (userRole !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can delete courses" });
    }
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const addDocToCourse = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    await mongoose.connect(CONNECTION_STRING);
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    course.docs.push({ title, content, quizzes: [] });
    await course.save();
    res.status(201).json({ message: "Doc added", docs: course.docs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addQuizToDoc = async (req, res) => {
  const { id, docId } = req.params;
  const { question, options, correctAnswer } = req.body;

  try {
    await mongoose.connect(CONNECTION_STRING);

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const doc = course.docs.id(docId);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    doc.quizzes.push({ question, options, correctAnswer });
    await course.save();

    res.status(201).json({ message: "Quiz added", quizzes: doc.quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteDocFromCourse = async (req, res) => {
  const { id, docId } = req.params;

  try {
    await mongoose.connect(CONNECTION_STRING);

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.docs = course.docs.filter((doc) => doc._id.toString() !== docId);
    await course.save();

    res.json({ message: "Doc deleted", docs: course.docs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuizFromDoc = async (req, res) => {
  const { id, docId, quizId } = req.params;

  try {
    await mongoose.connect(CONNECTION_STRING);

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const doc = course.docs.id(docId);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    doc.quizzes = doc.quizzes.filter((q) => q._id.toString() !== quizId);
    await course.save();

    res.json({ message: "Quiz deleted", quizzes: doc.quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCoursesWithOutDocsAndQuizz = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    const courses = await Course.find({}, "-quizzes -docs");
    res.status(200).json({ total: courses.length, courses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getAllDocsFromCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await mongoose.connect(CONNECTION_STRING);
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ docs: course.docs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateDocInCourse = async (req, res) => {
  const { id, docId } = req.params;
  const { title, content } = req.body;

  try {
    await mongoose.connect(CONNECTION_STRING);
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const doc = course.docs.id(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (title) doc.title = title;
    if (content) doc.content = content;

    await course.save();
    res.status(200).json({ message: "Document updated", doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateQuizInDoc = async (req, res) => {
  const { id, docId, quizId } = req.params;
  const { question, options, correctAnswer } = req.body;

  try {
    await mongoose.connect(CONNECTION_STRING);
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const doc = course.docs.id(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    const quiz = doc.quizzes.id(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    if (question) quiz.question = question;
    if (options) quiz.options = options;
    if (correctAnswer !== undefined) quiz.correctAnswer = correctAnswer;
    await course.save();
    res.status(200).json({ message: "Quiz updated", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllQuizzesInDoc = async (req, res) => {
  const { id, docId } = req.params;
  try {
    await mongoose.connect(CONNECTION_STRING);
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const doc = course.docs.id(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.status(200).json({ quizzes: doc.quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getQuizById = async (req, res) => {
  const { id, docId, quizId } = req.params;

  try {
    await mongoose.connect(CONNECTION_STRING);
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const doc = course.docs.id(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    const quiz = doc.quizzes.id(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  createCourse,
  userGetCourses,
  updateCourse,
  deleteCourse,
  addDocToCourse,
  addQuizToDoc,
  deleteDocFromCourse,
  deleteQuizFromDoc,
  getAllCoursesWithOutDocsAndQuizz,
  getAllDocsFromCourse,
  updateDocInCourse,
  updateQuizInDoc,
  getQuizById,
  getAllQuizzesInDoc,

};
