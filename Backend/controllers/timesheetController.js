const Timesheet = require('../models/Timesheet');

// POST /api/timesheets
exports.addTimesheet = async (req, res) => {
  try {
    const timesheet = new Timesheet(req.body);
    const saved = await timesheet.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save timesheet', error: err.message });
  }
};

// GET /api/timesheets
exports.getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find().sort({ date: -1 });
    res.json(timesheets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch timesheets', error: err.message });
  }
};

// GET /api/timesheets/:employeeId
exports.getTimesheetsByEmployeeId = async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ employeeId: req.params.employeeId });
    res.json(timesheets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employee timesheets', error: err.message });
  }
};
