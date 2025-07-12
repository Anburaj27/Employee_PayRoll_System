
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSignup from '../features/auth/AdminSignup';
import Sidebar from '../Components/Sidebar';
import AttendanceList from '../attendence/AttendanceList';
import LeaveApprovalList from '../leaveform/LeaveApprovalList';
import TimesheetList from '../features/Timesheet/TimesheetList';
import EmployeeList from '../features/Employee/EmployeeList';
import EmployeeSignup from '../features/Employee/EmployeeSignup';
import AttendanceForm from '../attendence/AttendanceForm';
import Dashboard from '../Components/Dashboard';
import PayrollForm from '../features/PayRoll/PayrollForm';
import PayrollReport from '../features/PayRoll/PayrollReport';

const AppRoutes = () => {

  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Routes>
          <Route path="home" element={<Dashboard />} />
          <Route path="edit-employee/:employeeId" element={<EmployeeSignup />} />
          <Route path='/signup' element={<AdminSignup />} />
          <Route path='/payroll' element={<PayrollForm />} />
          <Route path='/payroll/report' element={<PayrollReport />} />
          <Route path="employee" element={<EmployeeSignup />} />
          <Route path="employee/details" element={<EmployeeList />} />
          <Route path="attendance" element={<AttendanceForm />} />
          <Route path="attendance/list" element={<AttendanceList />} />
          <Route path="leaveApprove" element={<LeaveApprovalList />} />
          <Route path="timesheet/list" element={<TimesheetList />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;


