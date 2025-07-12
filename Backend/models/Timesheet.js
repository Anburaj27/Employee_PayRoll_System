const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema({
  date: { type: String, required: true },
  projectName: { type: String, required: true },

  taskDescription: { type: String, required: true },
  status: { type: String, required: true },
  remarks: { type: String },
  employeeId: { type: String, required: true },
   name: {  
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timesheet', TimesheetSchema);
