const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subject: { type: String, required: true },
  examType: { type: String, enum: ['Quiz', 'Midterm', 'Final', 'Assignment'] },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  grade: String,
  remarks: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Mark', markSchema);