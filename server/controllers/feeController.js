const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Class = require('../models/Class');

// Create a new fee record
exports.createFee = async (req, res, next) => {
  try {
    const { studentId, classId, feeType, amount, dueDate, remarks } = req.body;
    
    // Validate student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    // Validate class exists if provided
    if (classId) {
      const classExists = await Class.findById(classId);
      if (!classExists) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }
    }
    
    const newFee = await Fee.create({
      student: studentId,
      class: classId,
      feeType,
      amount,
      dueDate,
      remarks,
      status: 'Unpaid'
    });
    
    res.status(201).json({
      success: true,
      data: newFee
    });
  } catch (err) {
    next(err);
  }
};

// Record fee payment
exports.recordPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod, receiptNumber } = req.body;
    
    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    // Update payment details
    fee.paidDate = new Date();
    fee.paymentMethod = paymentMethod;
    fee.receiptNumber = receiptNumber;
    
    // Check if full or partial payment
    if (paidAmount >= fee.amount) {
      fee.status = 'Paid';
    } else {
      fee.status = 'Partial';
      // You might want to create a new record for the remaining amount
    }
    
    await fee.save();
    
    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (err) {
    next(err);
  }
};

// Get all fees for a student
exports.getStudentFees = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    const fees = await Fee.find({ student: studentId })
      .populate('class', 'className')
      .sort('-dueDate');
      
    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (err) {
    next(err);
  }
};

// Get fees by status (Paid/Unpaid/Partial)
exports.getFeesByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    
    const fees = await Fee.find({ status })
      .populate('student', 'firstName lastName enrollNumber')
      .populate('class', 'className')
      .sort('-dueDate');
      
    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (err) {
    next(err);
  }
};

// Update fee details
exports.updateFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { feeType, amount, dueDate, remarks } = req.body;
    
    const fee = await Fee.findByIdAndUpdate(
      id,
      { feeType, amount, dueDate, remarks },
      { new: true, runValidators: true }
    );
    
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (err) {
    next(err);
  }
};

// Delete fee record
exports.deleteFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const fee = await Fee.findByIdAndDelete(id);
    
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};