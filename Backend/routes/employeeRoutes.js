const express = require('express');
const router = express.Router();

const {
  Signup,
  login,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
} = require('../controllers/authController');
const upload =require('../middleware/upload')




router.post('/signup', upload.single('profileImage'), Signup);    
router.post('/login', login);         

// ==================== Employee Management Routes ====================


router.get('/employees', getAllEmployees);  // GET /api/employees

// GET single employee by ID
router.get('/employees/:employeeId', getEmployeeById);  

// PUT (update) employee info by ID
router.put('/employees/:employeeId', upload.single('profileImage'),updateEmployee);  

// DELETE employee by ID
router.delete('/employees/:id', deleteEmployee); 



router.patch('/employees/:id/status', toggleEmployeeStatus); 
module.exports = router;
