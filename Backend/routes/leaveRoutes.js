const express = require('express');
const {
  applyLeave,
  getAllLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
} = require('../controllers/leaveController');

const router = express.Router();

router.post('/apply', applyLeave);
router.get('/all', getAllLeaves);
router.get('/:employeeId', getEmployeeLeaves);
router.put('/update-status/:leaveId', updateLeaveStatus);

module.exports = router;
