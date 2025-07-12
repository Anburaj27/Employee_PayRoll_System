const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/User');


exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, name, date, time } = req.body;

    const alreadyMarked = await Attendance.findOne({ employeeId, date });
    if (alreadyMarked) {
      return res.status(409).json({ message: 'Attendance already marked for this date' });
    }

    const newAttendance = new Attendance({
      employeeId,
      name,
      date,
      time,
      status: 'Present',
    });

    await newAttendance.save();
    res.status(201).json({ message: 'Attendance marked as Present', data: newAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

// GET /api/attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// GET /api/attendance/:employeeId
exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendance = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee attendance', error: error.message });
  }
};

// GET /api/attendance/absent/:date
exports.getAbsentEmployees = async (req, res) => {
  try {
    const { date } = req.params;

    const employees = await Employee.find();
    const presentRecords = await Attendance.find({ date });
    const presentIds = presentRecords.map(rec => rec.employeeId);

    const absentEmployees = employees.filter(emp => !presentIds.includes(emp.employeeId));

    const absentList = absentEmployees.map(emp => ({
      employeeId: emp.employeeId,
      name: emp.name,
      date,
      status: 'Absent',
    }));

    res.status(200).json(absentList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching absent employees', error: error.message });
  }
};
