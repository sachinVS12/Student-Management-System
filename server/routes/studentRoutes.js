const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', studentController.getAllStudents);
router.post('/', authorize('admin', 'teacher'), studentController.createStudent);
// Add other routers

module.exports = router;