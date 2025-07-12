
// LeaveForm.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  applyLeaveRequest,
  fetchLeavesRequest,
  clearLeaveMessage,
} from './leaveSlice';
import { useNavigate } from 'react-router-dom';

const LeaveForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRef = useRef();

  const { user } = useSelector((state) => state.auth);
  const { leaves, loading, successMessage, error } = useSelector((state) => state.leave);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    session: 'Full Day',
    reason: '',
    hours: '',
  });

  const [filter, setFilter] = useState('');
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData((prev) => ({
        ...prev,
        employeeId: user.employeeId || '',
        name: user.name || '',
      }));
      dispatch(fetchLeavesRequest());
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearLeaveMessage()), 3000);

      if (successMessage) {
        // Clear form fields
        setFormData((prev) => ({
          employeeId: user.employeeId || '',
          name: user.name || '',
          leaveType: '',
          startDate: '',
          endDate: '',
          session: 'Full Day',
          reason: '',
          hours: '',
        }));
      }

      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch, user]);


  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'leaveType') {
      setFormData((prev) => ({
        ...prev,
        leaveType: value,
        session: value === 'Permission' ? 'Morning' : 'Full Day',
        hours: value === 'Permission' ? prev.hours : '',
        endDate: value === 'Permission' ? '' : prev.endDate,
      }));
    } else if (name === 'startDate') {
      setFormData((prev) => ({
        ...prev,
        startDate: value,
        endDate: prev.endDate < value ? '' : prev.endDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.leaveType === 'Permission' && !formData.hours) {
      alert('Please enter hours for Permission leave');
      return;
    }

    const payload = {
      ...formData,
      status: 'Pending',
      hours: formData.leaveType === 'Permission' ? Number(formData.hours) : undefined,
    };

    setPendingPayload(payload);
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  const confirmSubmit = () => {
    if (pendingPayload) {
      dispatch(applyLeaveRequest(pendingPayload));
      const modal = window.bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
    }
  };

  const employeeLeaves = [...leaves]
    .filter((leave) => leave.employeeId === user?.employeeId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((leave) =>
      filter === '' ||
      leave.leaveType.toLowerCase().includes(filter.toLowerCase()) ||
      leave.status.toLowerCase().includes(filter.toLowerCase())
    );


  return (
    <div className="container py-5" style={{ marginLeft: '380px' }}>
      <h2 className="text-primary mb-4 text-center">
        <i className="bi bi-calendar-check-fill me-2"></i>Leave Application & History
      </h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}


      <form onSubmit={handleSubmit} className="card shadow-lg rounded-4 border-0 mb-5">
        <div className="card-header bg-primary text-white py-3 rounded-top-4 text-center">
          <h5 className="mb-0">
            <i className="bi bi-pencil-square me-2"></i>
            Apply for Leave
          </h5>
        </div>
        <div className="card-body bg-light">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Employee ID</label>
              <input type="text" name="employeeId" className="form-control" value={formData.employeeId} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label">Employee Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label">Leave Type</label>
              <select name="leaveType" className="form-select" value={formData.leaveType} onChange={handleFormChange} required>
                <option value="">Select Leave Type</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Permission">Permission</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {formData.leaveType === 'Permission' && (
              <div className="col-md-6">
                <label className="form-label">Hours</label>
                <input type="number" name="hours" className="form-control" value={formData.hours} onChange={handleFormChange} min="1" required />
              </div>
            )}
            <div className="col-md-6">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleFormChange}
                min={getTomorrowDate()}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleFormChange}
                min={formData.startDate || getTomorrowDate()}
                disabled={formData.leaveType === 'Permission'}
                required={formData.leaveType !== 'Permission'}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Session</label>
              <select name="session" className="form-select" value={formData.session} onChange={handleFormChange} required>
                {formData.leaveType === 'Permission' ? (
                  <>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                  </>
                ) : (
                  <>
                    <option value="Full Day">Full Day</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                  </>
                )}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Reason</label>
              <textarea name="reason" className="form-control" rows="3" value={formData.reason} onChange={handleFormChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100 py-2 mt-4" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Submitting...
              </>
            ) : (
              <><i className="bi bi-send-check me-2"></i>Apply Leave</>
            )}
          </button>
        </div>
      </form>

      {/* Search Bar */}
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="🔍 Filter by type or status..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Leave History Table */}
      <div className="card shadow-lg rounded-4 border-0 ">
        <div className="card-header bg-secondary text-white py-3 rounded-top-4">
          <h5 className="mb-0"><i className="bi bi-clock-history me-2"></i>My Leave History</h5>
        </div>
        <div className="card-body p-0">
          {employeeLeaves.length === 0 ? (
            <p className="p-3">No leave records found.</p>
          ) : (
            <table className="table table-striped table-hover align-middle mb-0 ">
              <thead className="table-light">
                <tr className="text-center">
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Session</th>
                  <th>Hours</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employeeLeaves.map((leave) => (
                  <tr key={leave._id || leave.id} className="text-center">
                    <td><span className="badge bg-primary">{leave.leaveType}</span></td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate || '-'}</td>
                    <td>{leave.session}</td>
                    <td>{leave.leaveType === 'Permission' ? leave.hours : '-'}</td>
                    <td className="text-start">{leave.reason}</td>
                    <td>
                      <span className={`badge px-3 py-2 rounded-pill ${leave.status === 'Approved' ? 'bg-success' :
                          leave.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Confirmation */}
      <div className="modal fade" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Leave Application</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to apply for this leave?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={confirmSubmit}>
                <i className="bi bi-check2-circle me-1"></i>Yes, Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveForm;


