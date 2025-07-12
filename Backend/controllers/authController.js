const User = require('../models/User');
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const bwipjs = require('bwip-js');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


// =================== EMPLOYEE ID GENERATOR ===================
const generateEmployeeId = async (name) => {
  const companyCode = 'SMT';
  const namePart = name.trim().substring(0, 3).toLowerCase();

  
  const lastUser = await User.findOne({ employeeId: { $exists: true } })
    .sort({ createdAt: -1 }) 
    .lean();

  let lastNumber = 0;
  if (lastUser && lastUser.employeeId) {
    const match = lastUser.employeeId.match(/\d+$/); 
    if (match) lastNumber = parseInt(match[0], 10);
  }

  const numberPart = String(lastNumber + 1).padStart(3, '0');
  return `${namePart}${companyCode.toLowerCase()}${numberPart}`;
};




// =================== BARCODE GENERATOR ===================
const generateBarcodeBase64 = async (text) => {
  try {
    const pngBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    });
    return `data:image/png;base64,${pngBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Barcode generation failed:', error.message);
    return null;
  }
};

// =================== SIGNUP ===================


exports.Signup = async (req, res) => {
  try {
    const {
      phone,
      name,
      email,
      password,
      role, // 'admin' or 'employee'
      dob,
      department,
      designation,
      joiningDate,
      address,
      gender,
      salary,
    } = req.body;

    // ✅ Validate required fields (basic example, optional)
    if (!email || !password || !phone || !name || !role) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // ✅ Check if phone is already used
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // ✅ Check if email already exists in correct model
    const emailCheckModel = role === 'admin' ? AdminUser : User;
    const existingEmail = await emailCheckModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

 
    const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      dob: dob ? new Date(dob) : undefined,
      department,
      designation,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      address,
      gender,
      role,
      salary,
      profileImage,
    };

    
    if (role === 'employee') {
      userData.employeeId = await generateEmployeeId(name);
      userData.isActive = true;
      userData.barcode = await generateBarcodeBase64(userData.employeeId);
    }

 
    const newUser = new emailCheckModel(userData);
    await newUser.save();


    const responseUser = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      ...(role === 'employee' && {
        employeeId: newUser.employeeId,
        barcode: newUser.barcode,
        isActive: newUser.isActive,
        profileImage: newUser.profileImage,
      }),
    };

    res.status(201).json({
      message: 'Registered successfully',
      user: responseUser,
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};


// =================== LOGIN ===================
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = role === 'admin' ? AdminUser : User;
    const user = await Model.findOne({ email, role });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        ...(role === 'employee' && {
          employeeId: user.employeeId,
          isActive: user.isActive,
          barcode: user.barcode,
        }),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// =================== GET ALL EMPLOYEES ===================
exports.getAllEmployees = async (req, res) => {
  try {
    const statusFilter =
      req.query.status === 'inactive' ? { isActive: false } :
      req.query.status === 'active' ? { isActive: true } : {};

    const employees = await User.find(statusFilter).select('-password');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

// =================== GET SINGLE EMPLOYEE ===================
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findOne({ employeeId: req.params.employeeId }).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =================== UPDATE EMPLOYEE ===================
exports.updateEmployee = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    if (req.file) updates.profileImage = `/uploads/${req.file.filename}`;

    const updated = await User.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      updates,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Updated successfully', employee: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
};

// =================== DELETE EMPLOYEE ===================
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};


// =================== TOGGLE EMPLOYEE STATUS ===================
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Server error while toggling status', error: error.message });
  }
};



