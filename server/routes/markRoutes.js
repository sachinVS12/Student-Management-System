const express = require('express');
const router = express.Router();
const markController = require('../controllers/markController');
const { authenticate, authorize } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// Teacher and admin can add marks
router.post('/', authorize('admin', 'teacher'), markController.addMarks);

// Anyone authenticated can view marks
router.get('/student/:studentId', markController.getStudentMarks);
router.get('/class/:classId/subject/:subject', markController.getClassSubjectMarks);

// Only teacher and admin can update/delete marks
router.put('/:id', authorize('admin', 'teacher'), markController.updateMarks);
router.delete('/:id', authorize('admin', 'teacher'), markController.deleteMarks);

module.exports = router;