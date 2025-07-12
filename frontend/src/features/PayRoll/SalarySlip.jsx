import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SalarySlip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.slipData;

  if (!data) {
    return (
      <div className="container text-center my-5">
        <h5>No salary slip data available.</h5>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const {
    employeeName,
    employeeId,
    month,
    year,
    workingDays,
    leaveDays = 0,
    bonus,
    pf,
    esi,
    otherDeductions,
    grossPay,
    netPay,
  } = data;

  return (
    <div
      className="p-5 bg-white"
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Segoe UI, sans-serif',
        border: '1px solid #ccc',
      }}
    >
      {/* Header */}
      <div className="text-center mb-5 border-bottom pb-3">
        <h2 className="text-primary mb-1">Smount Tech Pvt Ltd</h2>
        <p className="mb-0 text-muted">#42, IT complex Arcot, Tamilnadu, India - 632503</p>
        <p className="fw-semibold mt-2">Salary Slip - {month} {year}</p>
      </div>

      {/* Employee Info */}
      <div className="row mb-4">
        <div className="col">
          <p><strong>Employee Name:</strong> {employeeName}</p>
          <p><strong>Employee ID:</strong> {employeeId}</p>
        </div>
        <div className="col text-end">
          <p><strong>Month:</strong> {month}</p>
          <p><strong>Year:</strong> {year}</p>
        </div>
      </div>

      {/* Salary Details */}
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Working Days</th>
            <td>{workingDays}</td>
            <th>Leave Days</th>
            <td>{leaveDays}</td>
          </tr>
          <tr>
            <th>Bonus</th>
            <td>₹ {bonus?.toLocaleString()}</td>
            <th>Provident Fund (PF)</th>
            <td>₹ {pf?.toLocaleString()}</td>
          </tr>
          <tr>
            <th>Employee State Insurance (ESI)</th>
            <td>₹ {esi?.toLocaleString()}</td>
            <th>Other Deductions</th>
            <td>₹ {otherDeductions?.toFixed(2)}</td>
          </tr>
          <tr className="table-success">
            <th>Gross Pay</th>
            <td colSpan="3" className="fw-semibold">₹ {grossPay?.toLocaleString()}</td>
          </tr>
          <tr className="table-primary">
            <th>Net Pay (Take Home)</th>
            <td colSpan="3" className="fw-bold text-primary fs-5">₹ {netPay?.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="d-flex justify-content-between mt-5 align-items-center">
        <strong>Smount Tech Pvt Ltd</strong>
        <img
          src="/images/Seal.png"
          alt="Official Seal"
          style={{ width: '90px' }}
        />
      </div>

      {/* Buttons */}
      <div className="text-center mt-4 ">
        <button className="btn btn-secondary me-3" onClick={() => navigate(-1)}>
          Close
        </button>
        <button className="btn btn-success" onClick={() => window.print()}>
          🖨️ Print Salary Slip
        </button>
      </div>
    </div>
  );
};

export default SalarySlip;
