const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  birthDate: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  enrollNumber: { type: String, required: true, unique: true },
  enrollDate: { type: Date, default: Date.now },
  parentInfo: {
    fatherName: String,
    motherName: String,
    parentPhone: String
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);