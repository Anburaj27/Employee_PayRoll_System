import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTimesheet } from './timesheetSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TimesheetEntryForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    date: '',
    employeeId: '',
    name: '',
    projectName: '',
    taskDescription: '',
    status: '',
    remarks: '',
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (user) {
      setFormData((prev) => ({
        ...prev,
        date: today,
        employeeId: user.employeeId || '',
        name: user.name || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  // const isConfirmed = window.confirm("Are you sure you want to submit the log sheet?");
  // if (!isConfirmed) {
  //   return; // Cancel submission if user clicks "Cancel"
  // }

  dispatch(addTimesheet(formData));
  toast.success('Log sheet submitted successfully!', {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  setFormData((prev) => ({
    ...prev,
    projectName: '',
    taskDescription: '',
    status: '',
    remarks: '',
  }));
};


  return (
    <>
      <div className="container py-5" style={{ marginLeft: '380px' }}>
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0 text-center">Daily Work Log Sheet</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Date, Employee ID, Name */}
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>

              {/* Project Name */}
              <div className="mb-3">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Project Name"
                  required
                />
              </div>

              {/* Task Description */}
              <div className="mb-3">
                <label className="form-label">Task Description</label>
                <textarea
                  name="taskDescription"
                  value={formData.taskDescription}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="What did you do today?"
                  required
                ></textarea>
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Remarks */}
              <div className="mb-3">
                <label className="form-label">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Any additional remarks"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-success w-100">
                Submit Log Sheet
              </button>
            </form>
          </div>
        </div>
      </div>
 <ToastContainer position="top-right" />
    </>
  );
};

export default TimesheetEntryForm;
