const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true },
  academicYear: { type: String, required: true },
  teacherInCharge: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  schedule: {
    days: [String],
    startTime: String,
    endTime: String
  },
  capacity: Number,
  currentStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  subjects: [String]
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);