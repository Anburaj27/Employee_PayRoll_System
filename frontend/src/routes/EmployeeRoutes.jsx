import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeaveForm from '../leaveform/LeaveForm';
import TimesheetEntryForm from '../features/Timesheet/TimesheetEntryForm';
import EmployeeDashboard from '../Components/EmployeeDashboard';
import Sidebarpanel from '../Components/Sidebarpanel';
import AttendanceList from '../attendence/AttendanceList';

const EmployeeRoutes = () => {

  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return (
    <div style={{ display: 'flex' }}>
      <Sidebarpanel />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Routes>

          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="attendance/list" element={<AttendanceList />} />
          <Route path="leaveForm" element={<LeaveForm />} />
          <Route path="timesheet/entry" element={<TimesheetEntryForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default EmployeeRoutes;
