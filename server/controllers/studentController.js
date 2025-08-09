const Student = require('../models/Student');

exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort('-createdAt');
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { name, age, grade } = req.body;

    const newStudent = new Student({ name, age, grade });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err) {
    next(err);
  }
};
