import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import {
  fetchLeavesRequest,
  approveLeaveRequest,
  clearLeaveMessage,
} from './leaveSlice';

const LeaveApprovalList = () => {
  const dispatch = useDispatch();
  const { leaves, loading, successMessage, error } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (user) {
      dispatch(fetchLeavesRequest());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearLeaveMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleApprove = (id, status) => {
    Swal.fire({
      title: `Mark as ${status}?`,
      text: `Are you sure you want to ${status.toLowerCase()} this leave request?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: status === 'Approved' ? '#28a745' : '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${status.toLowerCase()} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(approveLeaveRequest({ id, status }));
      }
    });
  };

  const filteredLeaves = leaves
    .filter((leave) => {
      const matchesSearch =
        leave.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || leave.status === statusFilter;

      const isAdminMatch = user?.role === 'admin'
        ? matchesSearch && matchesStatus
        : leave.employeeId?.toLowerCase() === user?.employeeId?.toLowerCase();

      return isAdminMatch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container py-5" style={{ marginLeft: '380px' }}>
      <h2 className="mb-4 text-center">
        {user?.role === 'admin' ? 'Admin - Leave Approvals' : 'My Leave History'}
      </h2>

      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="mb-3 row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by Employee ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6 mt-2 mt-md-0">
 <select
  className="form-select"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="All">📋 All Statuses</option>
  <option value="Pending">🟡 Pending</option>
  <option value="Approved">🟢 Approved</option>
  <option value="Rejected">🔴 Rejected</option>
</select>

          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted text-center">Loading leave requests...</p>
      ) : filteredLeaves.length === 0 ? (
        <p className="text-muted text-center">No matching leave requests found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Session</th>
                <th>Hours</th>
                <th>Reason</th>
                <th>Status</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => {
                const id = leave._id || leave.id;
                const statusClass = {
                  Approved: 'badge bg-success',
                  Rejected: 'badge bg-danger',
                  Pending: 'badge bg-warning text-dark',
                }[leave.status] || 'badge bg-secondary';

                return (
                  <tr key={id}>
                    <td>{leave.employeeId}</td>
                    <td>{leave.name}</td>
                    <td><span className="badge bg-info text-dark">{leave.leaveType}</span></td>
                    <td>{leave.startDate ? new Date(leave.startDate).toLocaleDateString() : '-'}</td>
                    <td>{leave.endDate ? new Date(leave.endDate).toLocaleDateString() : '-'}</td>
                    <td>{leave.session}</td>
                    <td>{leave.leaveType === 'Permission' ? leave.hours : '-'}</td>
                    <td>{leave.reason}</td>
                    <td className="text-center">
                      <span className={statusClass}>{leave.status}</span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => handleApprove(id, 'Approved')}
                          title="Approve"
                        >
                          ✔
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleApprove(id, 'Rejected')}
                          title="Reject"
                        >
                          ✖
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalList;
