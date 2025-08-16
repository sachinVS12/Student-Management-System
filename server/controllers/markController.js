const Mark = require('../models/Marks');
const Student = require('../models/Student');
const Class = require('../models/Class');

// Add marks for a student
exports.addMarks = async (req, res, next) => {
  try {
    const { studentId, classId, subject, examType, marksObtained, maxMarks, remarks } = req.body;
    
    // Validate student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    // Validate class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    
    // Calculate grade (simple example)
    const percentage = (marksObtained / maxMarks) * 100;
    let grade;
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';
    
    const newMark = await Mark.create({
      student: studentId,
      class: classId,
      subject,
      examType,
      marksObtained,
      maxMarks,
      grade,
      remarks
    });
    
    res.status(201).json({
      success: true,
      data: newMark
    });
  } catch (err) {
    next(err);
  }
};

// Get all marks for a student
exports.getStudentMarks = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    const marks = await Mark.find({ student: studentId })
      .populate('class', 'className academicYear')
      .sort('-createdAt');
      
    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks
    });
  } catch (err) {
    next(err);
  }
};

// Update marks
exports.updateMarks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { marksObtained, maxMarks, remarks } = req.body;
    
    // Find the mark record
    const mark = await Mark.findById(id);
    if (!mark) {
      return res.status(404).json({ success: false, message: 'Mark record not found' });
    }
    
    // Update and recalculate grade
    if (marksObtained) mark.marksObtained = marksObtained;
    if (maxMarks) mark.maxMarks = maxMarks;
    if (remarks) mark.remarks = remarks;
    
    const percentage = (mark.marksObtained / mark.maxMarks) * 100;
    if (percentage >= 90) mark.grade = 'A';
    else if (percentage >= 80) mark.grade = 'B';
    else if (percentage >= 70) mark.grade = 'C';
    else if (percentage >= 60) mark.grade = 'D';
    else mark.grade = 'F';
    
    await mark.save();
    
    res.status(200).json({
      success: true,
      data: mark
    });
  } catch (err) {
    next(err);
  }
};

// Delete marks
exports.deleteMarks = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const mark = await Mark.findByIdAndDelete(id);
    
    if (!mark) {
      return res.status(404).json({ success: false, message: 'Mark record not found' });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// Get marks by class and subject
exports.getClassSubjectMarks = async (req, res, next) => {
  try {
    const { classId, subject } = req.params;
    
    const marks = await Mark.find({ class: classId, subject })
      .populate('student', 'firstName lastName enrollNumber')
      .sort('-createdAt');
      
    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks
    });
  } catch (err) {
    next(err);
  }
};