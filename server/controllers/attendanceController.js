const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');

// Mark attendance for a student
exports.markAttendance = async (req, res, next) => {
  try {
    const { studentId, classId, date, status, remarks } = req.body;

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

    const attendance = await Attendance.create({
      student: studentId,
      class: classId,
      date: date || new Date(),
      status,
      remarks,
      recordedBy: req.user.userId
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance already marked for this student on the specified date' 
      });
    }
    next(err);
  }
};

// Bulk mark attendance for multiple students
exports.markBulkAttendance = async (req, res, next) => {
  try {
    const { classId, date, attendanceRecords } = req.body;

    const results = await Promise.all(
      attendanceRecords.map(async (record) => {
        try {
          const attendance = await Attendance.create({
            student: record.studentId,
            class: classId,
            date: date || new Date(),
            status: record.status,
            remarks: record.remarks,
            recordedBy: req.user.userId
          });
          return { success: true, data: attendance };
        } catch (err) {
          return { 
            success: false, 
            error: err.message,
            studentId: record.studentId 
          };
        }
      })
    );

    res.status(201).json({ results });
  } catch (err) {
    next(err);
  }
};

// Get attendance for a specific student
exports.getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ student: studentId })
      .populate('class', 'className')
      .sort('-date');

    res.status(200).json({ 
      success: true, 
      count: attendance.length,
      data: attendance 
    });
  } catch (err) {
    next(err);
  }
};

// Get attendance for a specific class on a date
exports.getClassAttendance = async (req, res, next) => {
  try {
    const { classId, date } = req.params;

    const attendance = await Attendance.find({ 
      class: classId,
      date: new Date(date) 
    })
    .populate('student', 'firstName lastName enrollNumber')
    .sort('status');

    res.status(200).json({ 
      success: true, 
      count: attendance.length,
      data: attendance 
    });
  } catch (err) {
    next(err);
  }
};

// Update attendance record
exports.updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({ 
        success: false, 
        message: 'Attendance record not found' 
      });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    next(err);
  }
};