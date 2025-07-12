const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
  getAbsentEmployees,
} = require('../controllers/attendanceController');


router.post('/', markAttendance);


router.get('/', getAllAttendance);


router.get('/:employeeId', getAttendanceByEmployee);


router.get('/absent/:date', getAbsentEmployees);

module.exports = router;
