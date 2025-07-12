const Leave = require('../models/Leave');

const applyLeave = async (req, res) => {
  try {
    const leaveData = req.body;
    const leave = new Leave(leaveData);
    await leave.save();
    return res.status(201).json(leave);
  } catch (error) {
    console.error('Apply leave error:', error);
    return res.status(500).json({ message: 'Error applying for leave', error: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ appliedAt: -1 });
    return res.status(200).json(leaves);
  } catch (error) {
    console.error('Get all leaves error:', error);
    return res.status(500).json({ message: 'Error fetching leaves', error: error.message });
  }
};




const getEmployeeLeaves = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaves = await Leave.find({ employeeId }).sort({ appliedAt: -1 });
    return res.status(200).json(leaves);
  } catch (error) {
    console.error('Get employee leaves error:', error);
    return res.status(500).json({ message: 'Error fetching employee leaves', error: error.message });
  }
};


const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    return res.status(200).json(updatedLeave);
  } catch (error) {
    console.error('Update leave status error:', error);
    return res.status(500).json({ message: 'Error updating leave status', error: error.message });
  }
};

module.exports = {
  applyLeave,
  getAllLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
};
