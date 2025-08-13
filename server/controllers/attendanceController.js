const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res, next) => {
  try {
    const { student, class: classId, date, status, remarks } = req.body;
    
    const attendance = await Attendance.create({
      student,
      class: classId,
      date: date || new Date(),
      status,
      remarks,
      recordedBy: req.user.userId
    });
    
    res.status(201).json(attendance);
  } catch (err) {
    next(err);
  }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ student: studentId })
      .populate('class', 'className')
      .sort('-date');
    
    res.json(attendance);
  } catch (err) {
    next(err);
  }
};