const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  feeType: { type: String, required: true, enum: ['Tuition', 'Library', 'Sports', 'Transport', 'Other'] },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: Date,
  status: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
  paymentMethod: String,
  receiptNumber: String,
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);