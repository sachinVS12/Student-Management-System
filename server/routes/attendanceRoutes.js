const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// Teachers/admins can mark attendance
router.post(
  '/', 
  authorize('admin', 'teacher'), 
  attendanceController.markAttendance
);

// Bulk attendance marking (for entire class)
router.post(
  '/bulk', 
  authorize('admin', 'teacher'), 
  attendanceController.markBulkAttendance
);

// Get attendance for a specific student
router.get(
  '/student/:studentId', 
  authorize('admin', 'teacher', 'student'), 
  attendanceController.getStudentAttendance
);

// Get attendance for a class on specific date
router.get(
  '/class/:classId/date/:date', 
  authorize('admin', 'teacher'), 
  attendanceController.getClassAttendance
);

// Update attendance record
router.put(
  '/:id', 
  authorize('admin', 'teacher'), 
  attendanceController.updateAttendance
);

module.exports = router;