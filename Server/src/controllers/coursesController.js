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
    const user = await User.findById(userId).populate(
      "purchasedCourses",
      null,
      null,
      { strictPopulate: false }
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: { message: "User not found" },
      });
    }

    const purchasedIds = (user.purchasedCourses || []).map((course) =>
      course._id.toString()
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
module.exports = {
  getCourses,
  createCourse,
  userGetCourses,
  updateCourse,
  deleteCourse,
};
