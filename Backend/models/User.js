const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['employee', 'admin', 'manager'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  dob: String,
  department: String,
  designation: String,
  joiningDate: String,
  address: String,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
  },
    salary: {
     type: Number,
     min: 0,
    },
  barcode: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  statusChangedAt: Date,
  statusChangedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
  },
    profileImage: String, 
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);




