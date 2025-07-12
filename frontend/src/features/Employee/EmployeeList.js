import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
  fetchEmployeesRequest,
  deleteEmployeeRequest,
  getEmployeeByIdRequest,
  toggleEmployeeStatusRequest,
} from '../Employee/employeeSlice';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees, loading, error } = useSelector((state) => state.employee);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEmployeesRequest());
  }, [dispatch]);

  const handleEdit = (id) => {
    dispatch(getEmployeeByIdRequest(id));
    navigate(`/admin/edit-employee/${id}`);
  };

const handleDelete = (id) => {
  Swal.fire({
    title: 'Are you sure you want to delete this employee?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(deleteEmployeeRequest(id));
      Swal.fire('Deleted!', 'The employee has been successfully deleted.', 'success');
    }
  });
};

const handleToggleStatus = (id, isActive) => {
  const action = isActive ? 'deactivate' : 'activate';

  Swal.fire({
    title: `Are you sure you want to ${action} this employee?`,
    text: `This employee will be ${action}d.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: isActive ? '#d33' : '#28a745',
    cancelButtonColor: '#6c757d',
    confirmButtonText: `Yes, ${action} it`,
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(toggleEmployeeStatusRequest({ id, isActive: !isActive }));
      Swal.fire(
        `${action.charAt(0).toUpperCase() + action.slice(1)}d!`,
        `The employee has been successfully ${action}d.`,
        'success'
      );
    }
  });
};
  const exportToExcel = () => {
    const data = employees.map(({ _id, password, ...emp }) => emp); // Exclude sensitive fields
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    XLSX.writeFile(workbook, 'EmployeeList.xlsx');
  };

  const handlePrint = (employee) => {
    const printWindow = window.open('', '', 'width=400,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee ID Card</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              text-align: center;
            }
            .id-card {
              border: 1px solid #333;
              border-radius: 10px;
              padding: 20px;
              width: 300px;
              margin: 0 auto;
              box-shadow: 0 0 10px rgba(0,0,0,0.2);
            }
            .company-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #2c3e50;
            }
            .field {
              margin: 8px 0;
              font-size: 14px;
            }
            .barcode {
              margin-top: 15px;
              height: 80px;
            }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="company-name">Smount Tech Pvt Ltd</div>
            <hr/>
            <div class="field"><strong>ID:</strong> ${employee.employeeId}</div>
            <div class="field"><strong>Name:</strong> ${employee.name}</div>
            <div class="field"><strong>Email:</strong> ${employee.email}</div>
            ${
              employee.barcode
                ? `<img class="barcode" src="${employee.barcode}" alt="Barcode"/>`
                : `<div class="field">No Barcode Available</div>`
            }
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const filteredEmployees = employees.filter((emp) => {
    const search = searchTerm.trim().toLowerCase();
    return Object.values(emp).some((val) =>
      String(val).toLowerCase().includes(search)
    );
  });

  return (
<div className="container py-5" style={{marginLeft:'380px'}}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employee List</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-success" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading employees...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Dept</th>
              <th>Designation</th>
              <th>Salary(Per-Year) (₹)</th>
              <th>Barcode</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.salary?.toLocaleString() || 'N/A'}</td>
                  <td>
                    {emp.barcode ? (
                      <img
                        src={emp.barcode}
                        alt="Barcode"
                        style={{ height: '50px' }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        emp.isActive ? 'bg-success' : 'bg-secondary'
                      }`}
                    >
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-info"
                        title="Print ID"
                        onClick={() => handlePrint(emp)}
                      >
                        🧾
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        title="Edit"
                        onClick={() => handleEdit(emp.employeeId)}
                      >
                        ✏
                      </button>
                      <button
                        className={`btn btn-sm ${
                          emp.isActive ? 'btn-warning' : 'btn-success'
                        }`}
                        title={emp.isActive ? 'Deactivate' : 'Activate'}
                        onClick={() => handleToggleStatus(emp._id, emp.isActive)}
                      >
                        {emp.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Delete"
                        onClick={() => handleDelete(emp._id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
