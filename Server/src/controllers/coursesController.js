const mongoose = require("mongoose");
const Course = require("../collection/courses.js");
const { ErrorMessage } = require("../dto/errorHandleDTO.js");

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

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
};
