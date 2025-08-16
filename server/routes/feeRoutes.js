const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { authenticate, authorize } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// Admin and accountant can manage fees
router.post('/', authorize('admin', 'accountant'), feeController.createFee);
router.put('/:id/pay', authorize('admin', 'accountant'), feeController.recordPayment);
router.put('/:id', authorize('admin', 'accountant'), feeController.updateFee);
router.delete('/:id', authorize('admin', 'accountant'), feeController.deleteFee);

// Students and staff can view fees
router.get('/student/:studentId', feeController.getStudentFees);
router.get('/status/:status', authorize('admin', 'accountant'), feeController.getFeesByStatus);

module.exports = router;