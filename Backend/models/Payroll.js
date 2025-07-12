const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },

  annualSalary: { type: Number, required: true },
  // basicSalary: { type: Number, required: true }, 
  perDaySalary: { type: Number, required: true },
  workingDays: { type: Number, required: true },

  bonus: { type: Number, default: 0 },
  pf: { type: Number, default: 0 },
  esi: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },

  grossPay: { type: Number, required: true },
  netPay: { type: Number, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);
