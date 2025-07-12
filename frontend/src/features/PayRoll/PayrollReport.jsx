// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { fetchPayrolls } from '../PayRoll/payrollSlice'; // Adjust path if needed

// const PayrollReport = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { payrolls, loading, error } = useSelector((state) => state.payroll);

//   useEffect(() => {
//     if (payrolls.length === 0) {
//       dispatch(fetchPayrolls());
//     }
//   }, [dispatch, payrolls.length]);

//   return (
//    <div className="container py-5" style={{marginLeft:'380px'}}>
//       <div className="card shadow-lg">
//         <div className="card-header bg-dark text-white text-center py-3">
//           <h4 className="mb-0 fw-bold">📊 Payroll Report</h4>
//         </div>

//         <div className="card-body p-4">
//           {loading && <div className="alert alert-info">Loading payroll data...</div>}
//           {error && <div className="alert alert-danger">{error}</div>}

//           {!loading && payrolls.length > 0 ? (
//             <div className="table-responsive">
//               <table className="table table-bordered table-hover align-middle text-center">
//                 <thead className="table-primary">
//                   <tr>
//                     <th>Emp ID</th>
//                     <th>Name</th>
//                     <th>Month</th>
//                     <th>Year</th>
//                     <th>Annual (₹)</th>
//                     <th>Per Day (₹)</th>
//                     <th>Working Days</th>
//                     <th>Bonus (₹)</th>
//                     <th>PF (₹)</th>
//                     <th>ESI (₹)</th>
//                     <th>Total Deductions (₹)</th>
//                     <th>Gross (₹)</th>
//                     <th>Net (₹)</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {payrolls.map((entry, index) => {
//                     const pf = entry.pf || 0;
//                     const esi = entry.esi || 0;
//                     const totalDeductions = entry.deductions || 0; // Assuming it includes pf + esi

//                     return (
//                       <tr key={index}>
//                         <td><span className="badge bg-secondary">{entry.employeeId}</span></td>
//                         <td className="text-start fw-semibold">{entry.employeeName}</td>
//                         <td>{entry.month}</td>
//                         <td>{entry.year}</td>
//                         <td>{entry.annualSalary?.toLocaleString()}</td>
//                         <td>{entry.perDaySalary?.toFixed(2)}</td>
//                         <td>{entry.workingDays}</td>
//                         <td>{entry.bonus}</td>
//                         <td>{pf.toFixed(2)}</td>
//                         <td>{esi.toFixed(2)}</td>
//                         <td>{totalDeductions.toFixed(2)}</td>
//                         <td className="fw-semibold text-success">{entry.grossPay?.toLocaleString()}</td>
//                         <td className="fw-semibold text-primary">{entry.netPay?.toLocaleString()}</td>
//                         <td>
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() =>
//                               navigate('/salaryslip', {
//                                 state: {
//                                   slipData: {
//                                     ...entry,
//                                     totalDeductions, // passing the correct deductions value
//                                   },
//                                 },
//                               })
//                             }
//                           >
//                             View Slip
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             !loading && <p className="text-center">No payroll records found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PayrollReport;


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPayrolls } from '../PayRoll/payrollSlice'; // Adjust path if needed

const PayrollReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { payrolls, loading, error } = useSelector((state) => state.payroll);

  useEffect(() => {
    if (payrolls.length === 0) {
      dispatch(fetchPayrolls());
    }
  }, [dispatch, payrolls.length]);

  return (
 <div className="py-5" style={{ marginLeft: '380px', width: '74%' }}>

      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center py-3">
          <h4 className="mb-0 fw-bold">📊 Payroll Report</h4>
        </div>

        <div className="card-body p-4">
          {loading && <div className="alert alert-info">Loading payroll data...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && payrolls.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Annual (₹)</th>
                    <th>Per Day (₹)</th>
                    <th>Working Days</th>
                    <th>Bonus (₹)</th>
                    <th>PF (₹)</th>
                    <th>ESI (₹)</th>
                    <th>Total Deductions (₹)</th>
                    <th>Gross (₹)</th>
                    <th>Net (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((entry, index) => {
                    const pf = entry.pf || 0;
                    const esi = entry.esi || 0;
                    const totalDeductions = entry.deductions || 0; // Assuming it includes pf + esi

                    return (
                      <tr key={index}>
                        <td><span className="badge bg-secondary">{entry.employeeId}</span></td>
                        <td className="text-start fw-semibold">{entry.employeeName}</td>
                        <td>{entry.month}</td>
                        <td>{entry.year}</td>
                        <td>{entry.annualSalary?.toLocaleString()}</td>
                        <td>{entry.perDaySalary?.toFixed(2)}</td>
                        <td>{entry.workingDays}</td>
                        <td>{entry.bonus}</td>
                        <td>{pf.toFixed(2)}</td>
                        <td>{esi.toFixed(2)}</td>
                        <td>{totalDeductions.toFixed(2)}</td>
                        <td className="fw-semibold text-success">{entry.grossPay?.toLocaleString()}</td>
                        <td className="fw-semibold text-primary">{entry.netPay?.toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate('/salaryslip', {
                                state: {
                                  slipData: {
                                    ...entry,
                                    totalDeductions, // passing the correct deductions value
                                  },
                                },
                              })
                            }
                          >
                            View Slip
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && <p className="text-center">No payroll records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollReport;
