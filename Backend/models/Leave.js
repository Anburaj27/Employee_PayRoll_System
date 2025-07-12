const mongoose = require('mongoose');
const Counter = require('./Counter');

const LeaveSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
   
  },
  name: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Permission', 'Maternity Leave', 'Others'],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: {
    type: Date,
    required: function () {
      return this.leaveType !== 'Permission';
    },
  },
  hours: {
    type: Number,
    required: function () {
      return this.leaveType === 'Permission';
    },
  },
  session: {
    type: String,
    enum: ['Full Day', 'Morning', 'Afternoon'],
    default: 'Full Day',
  },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  appliedAt: { type: Date, default: Date.now },
});

LeaveSchema.pre('validate', async function (next) {
  if (!this.employeeId) {
    const namePrefix = this.name.trim().substring(0, 3).toLowerCase();
    const companyCode = 'smt';

    const counter = await Counter.findByIdAndUpdate(
      { _id: 'leaveId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const paddedSeq = String(counter.seq).padStart(3, '0');
    this.employeeId = `${namePrefix}${companyCode}${paddedSeq}`;
  }
  next();
});

const Leave = mongoose.model('Leave', LeaveSchema);
module.exports = Leave;
