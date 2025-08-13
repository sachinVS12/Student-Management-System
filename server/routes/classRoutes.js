const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', classController.getAllClasses);
router.post('/', authorize('admin'), classController.createClass);
// Add other routes

module.exports = router;