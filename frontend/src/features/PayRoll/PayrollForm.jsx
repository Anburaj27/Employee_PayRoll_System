import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployeesRequest,
} from '../Employee/employeeSlice';
import { fetchAttendanceListRequest } from '../../attendence/attendanceSlice';
import { fetchLeavesRequest } from '../../leaveform/leaveSlice';
import {
  fetchPayrolls,
  fetchPayrollsSuccess,
  fetchPayrollsFailure,
  addPayroll,
  addPayrollSuccess,
  addPayrollFailure,
} from './payrollSlice';
import { createPayroll, getPayrolls } from '../../services/api';

const monthsList = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PayrollForm = () => {
  const dispatch = useDispatch();

  const { employees } = useSelector((state) => state.employee);
  const { attendanceList } = useSelector((state) => state.attendance);
  const { leaves } = useSelector((state) => state.leave);
  const { payrolls } = useSelector((state) => state.payroll);

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [payrollData, setPayrollData] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const WORKING_HOURS_PER_DAY = 8;

  useEffect(() => {
    dispatch(fetchEmployeesRequest());
    dispatch(fetchAttendanceListRequest());
    dispatch(fetchLeavesRequest());

    const fetchPayroll = async () => {
      dispatch(fetchPayrolls());
      try {
        const response = await getPayrolls();
        dispatch(fetchPayrollsSuccess(response.data));
      } catch (err) {
        dispatch(fetchPayrollsFailure(err.message));
      }
    };

    fetchPayroll();
  }, [dispatch]);

  useEffect(() => {
    if (!employees.length || !attendanceList.length) return;

    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    const getAdjustedWorkingDays = (empId) => {
      const attendanceDays = attendanceList.filter((att) => {
        const date = new Date(att.date);
        return (
          att.employeeId === empId &&
          date >= startOfMonth &&
          date <= endOfMonth &&
          ['Present', 'Late'].includes(att.status)
        );
      }).length;

      const empLeaves = leaves.filter((leave) => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        return (
          leave.employeeId === empId &&
          leave.status === 'Approved' &&
          leaveEnd >= startOfMonth &&
          leaveStart <= endOfMonth
        );
      });

      let leaveDeductionDays = 0;

      empLeaves.forEach((leave) => {
        if (leave.leaveType === 'Half Day') {
          leaveDeductionDays += 0.5;
        } else if (leave.leaveType === 'Permission' && leave.hours) {
          leaveDeductionDays += parseFloat(leave.hours) / WORKING_HOURS_PER_DAY;
        }
      });

      return Math.max(attendanceDays - leaveDeductionDays, 0);
    };

    const initializedPayroll = employees.map((emp) => {
      const annualSalary = parseFloat(emp.salary || 0);
      const perDaySalary = annualSalary / 365;
      const workingDays = parseFloat(getAdjustedWorkingDays(emp.employeeId).toFixed(2));
      const grossPay = perDaySalary * workingDays;

      const basicSalary = annualSalary * 0.4;
      const monthlyBasic = basicSalary / 12;
      const pf = monthlyBasic * 0.12;
      const esi = grossPay <= 21000 ? grossPay * 0.0075 : 0;

      const totalDeductions = parseFloat((pf + esi).toFixed(2));
      const netPay = parseFloat((grossPay - totalDeductions).toFixed(2));

      return {
        employeeId: emp.employeeId,
        employeeName: emp.name,
        month: monthsList[selectedMonth],
        year: selectedYear,
        annualSalary,
        perDaySalary: parseFloat(perDaySalary.toFixed(2)),
        workingDays,
        bonus: 0,
        pf: parseFloat(pf.toFixed(2)),
        esi: parseFloat(esi.toFixed(2)),
        deductions: totalDeductions,
        grossPay: parseFloat(grossPay.toFixed(2)),
        netPay,
        holdSalary: !emp.isActive,
        isActive: emp.isActive
      };
    });

    setPayrollData(initializedPayroll);
  }, [employees, attendanceList, leaves, selectedMonth, selectedYear]);

  const handleChange = (index, field, value) => {
    const updated = [...payrollData];

    if (field === 'holdSalary') {
      updated[index].holdSalary = value;
    } else {
      updated[index][field] = parseFloat(value) || 0;
    }

    const gross = updated[index].perDaySalary * updated[index].workingDays + updated[index].bonus;
    const totalDeductions = updated[index].pf + updated[index].esi;
    const net = gross - totalDeductions;

    updated[index].grossPay = parseFloat(gross.toFixed(2));
    updated[index].deductions = parseFloat(totalDeductions.toFixed(2));
    updated[index].netPay = parseFloat(net.toFixed(2));

    setPayrollData(updated);
  };

  const hasAlreadySubmitted = () => {
    return payrolls.some(
      (record) =>
        record.month === monthsList[selectedMonth] &&
        record.year === selectedYear
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toSubmit = payrollData.filter(p => !p.holdSalary);

    if (hasAlreadySubmitted()) {
      setSuccessMsg('⚠️ Payroll already submitted for this month.');
      return;
    }

    if (toSubmit.length === 0) {
      setSuccessMsg('⚠️ No payroll data to submit.');
      return;
    }

    dispatch(addPayroll());

    try {
      const response = await createPayroll({ payrolls: toSubmit });
      dispatch(addPayrollSuccess(response.data));
      setSuccessMsg('✅ Payroll submitted successfully!');
    } catch (error) {
      dispatch(addPayrollFailure(error.message || 'Submission failed'));
      setSuccessMsg('❌ Failed to submit payroll.');
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('');
    }, 3000);
  };

  return (
 <div className="py-5" style={{ marginLeft: '380px', width: '74%' }}>
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white text-center py-3">
          <h4 className="mb-0 fw-bold">
            🧾 Monthly Payroll - {monthsList[selectedMonth]} {selectedYear}
          </h4>
        </div>
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Select Month</label>
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {monthsList.map((month, idx) => (
                  <option value={idx} key={month}>{month}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Select Year</label>
              <input
                type="number"
                className="form-control"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
            </div>
          </div>
          {successMsg && (
            <div className="alert alert-info text-center fw-semibold">{successMsg}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Emp_ID</th>
                    <th>Employee</th>
                    <th>Annual (₹)</th>
                    <th>Per Day (₹)</th>
                    <th>Working Days</th>
                    <th>PF (₹)</th>
                    <th>ESI (₹)</th>
                    <th>Bonus (₹)</th>
                    <th>Deductions (₹)</th>
                    <th>Gross (₹)</th>
                    <th>Net (₹)</th>
                    <th>Hold</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((emp, index) => (
                    <tr key={emp.employeeId} className={emp.holdSalary ? 'table-warning' : ''}>
                      <td><span className="badge bg-secondary">{emp.employeeId}</span></td>
                      <td className="text-start fw-semibold">
                        {emp.employeeName} {!emp.isActive && <span className="badge bg-danger ms-2">Inactive</span>}
                      </td>
                      <td>{emp.annualSalary.toLocaleString()}</td>
                      <td>{emp.perDaySalary.toFixed(2)}</td>
                      <td>{emp.workingDays}</td>
                      <td>{emp.pf.toFixed(2)}</td>
                      <td>{emp.esi.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control form-control-sm"
                          value={emp.bonus}
                          onChange={(e) => handleChange(index, 'bonus', e.target.value)}
                          disabled={emp.holdSalary}
                        />
                      </td>
                      <td>{emp.deductions.toFixed(2)}</td>
                      <td className="fw-semibold text-success">{emp.grossPay.toLocaleString()}</td>
                      <td className="fw-semibold text-primary">{emp.netPay.toLocaleString()}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={emp.holdSalary}
                          onChange={(e) => handleChange(index, 'holdSalary', e.target.checked)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-lg btn-outline-success px-5 py-2 shadow-sm"
                disabled={payrollData.length === 0 || isSubmitting || hasAlreadySubmitted()}
              >
                💾 Submit Payroll
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedEmployee && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title fw-bold">
                  👤 Payroll Details - {selectedEmployee.employeeName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table table-borderless">
                  <tbody>
                    {Object.entries(selectedEmployee).map(([key, value]) => (
                      <tr key={key}>
                        <td className="fw-bold text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                        <td>{typeof value === 'number' ? value.toLocaleString() : value.toString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollForm;
