// controllers/payrollController.js
const Payroll = require('../models/Payroll');

exports.createPayroll = async (req, res) => {
  try {
    const { payrolls } = req.body;

    if (!Array.isArray(payrolls) || payrolls.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty payroll data.' });
    }

    const insertedPayrolls = await Payroll.insertMany(payrolls);
    res.status(201).json(insertedPayrolls);
  } catch (error) {
    console.error('Error creating payroll:', error);
    res.status(500).json({ error: 'Failed to create payroll records.' });
  }
};

exports.getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ createdAt: -1 });
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll records.' });
  }
};
