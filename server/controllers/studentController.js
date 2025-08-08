const Student = require('../models/Student');

exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort('-createdAt');
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

// Add other CRUD operations (getById, create, update, delete)