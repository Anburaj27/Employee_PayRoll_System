const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true }, 
  time: { type: String }, 
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Attendance', attendanceSchema);
