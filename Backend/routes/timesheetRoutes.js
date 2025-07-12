const express = require('express');
const router = express.Router();
const {
  getAllTimesheets,
  addTimesheet,
  getTimesheetsByEmployeeId,
} = require('../controllers/timesheetController');

// POST /api/timesheets
router.post('/', addTimesheet);

// GET /api/timesheets
router.get('/', getAllTimesheets);

// Optional: GET /api/timesheets/:employeeId
router.get('/:employeeId', getTimesheetsByEmployeeId);

module.exports = router;
