const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', authorize('admin', 'teacher'), studentController.createStudent);
router.put('/:id', authorize('admin', 'teacher'), studentController.updateStudent);
router.delete('/:id', authorize('admin'), studentController.deleteStudent);

module.exports = router;
