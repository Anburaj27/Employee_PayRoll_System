import React from 'react';
import LeaveForm from './LeaveForm';
import LeaveApprovalList from './LeaveApprovalList';

const EmployeeLeaveView = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Employee Leave Panel</h2>
      <LeaveForm />
      <hr />
      <LeaveApprovalList />
    </div>
  );
};

export default EmployeeLeaveView;
