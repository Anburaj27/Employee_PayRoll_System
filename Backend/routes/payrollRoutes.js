// routes/payrollRoutes.js
const express = require('express');
const router = express.Router();
const { createPayroll, getPayrolls } = require('../controllers/payrollController');

router.post('/payrolls', createPayroll);
router.get('/payrolls', getPayrolls);

module.exports = router;
