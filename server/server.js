require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/mark', require('./routes/markRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});


//start
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
//end


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));