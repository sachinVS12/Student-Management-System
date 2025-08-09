const Student = require('../models/Student');

// GET /students - Get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort('-createdAt');
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

// GET /students/:id - Get a student by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

// POST /students - Create a new student
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

// PUT /students/:id - Update a student
exports.updateStudent = async (req, res, next) => {
  try {
    const { name, age, grade } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, grade },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    next(err);
  }
};

// DELETE /students/:id - Delete a student
exports.deleteStudent = async (req, res, next) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
};
