import React from 'react';
import PayrollForm from '../PayRoll/PayrollForm';
import PayrollReport from '../PayRoll/PayrollReport';

const PayrollSummary = () => {
  return (
    <div className="p-4">
      <PayrollForm />
      <PayrollReport />
    </div>
  );
};

export default PayrollSummary;
