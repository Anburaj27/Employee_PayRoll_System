import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BellFill, Person, Activity, CalendarCheck, ClipboardCheck
} from 'react-bootstrap-icons';

const EmployeeDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        { id: 1, message: 'Your leave was approved ✅', date: '2025-06-17' },
        { id: 2, message: 'Your timesheet was submitted', date: '2025-06-15' },
      ]);
    }, 500);
  }, []);

  const tiles = [
    { icon: <Person size={28} />, label: 'Profile', desc: 'Edit your profile', path: '/employee/profile' },
    { icon: <Activity size={28} />, label: 'Activities', desc: 'Your recent tasks', path: '/employee/activities' },
    { icon: <CalendarCheck size={28} />, label: 'Leave', desc: 'Request time off', path: '/employee/leave-form' },
    { icon: <ClipboardCheck size={28} />, label: 'Timesheet', desc: 'Log your hours', path: '/employee/timesheet' },
  ];

  return (
    <div className="container-fluid" style={{ marginLeft: '280px', width: '84%' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary">
          Hello, <span className="text-decoration-underline">{user?.name || 'Employee'}</span>
        </h4>
        <div className="position-relative" role="button" onClick={() => setShowModal(true)}>
          <BellFill className="text-primary" size={24} />
          {notifications.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {notifications.length}
              <span className="visually-hidden">unread notifications</span>
            </span>
          )}
        </div>
      </div>

      {/* Tiles FIRST */}
      <div className="row g-4 mb-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="col-sm-6 col-lg-3">
            <div
              className="card h-100 text-center border-0 shadow-sm rounded-4 p-3"
              role="button"
              onClick={() => navigate(tile.path)}
            >
              <div className="mb-2 text-primary fs-4">{tile.icon}</div>
              <h6 className="fw-semibold">{tile.label}</h6>
              <small className="text-muted">{tile.desc}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Stats SECOND */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary text-center p-4 shadow-sm rounded-4">
            <h2 className="card-title">5</h2>
            <p className="card-text">Pending Tasks</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info text-center p-4 shadow-sm rounded-4">
            <h2 className="card-title">2</h2>
            <p className="card-text">Unread Messages</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning text-center p-4 shadow-sm rounded-4">
            <h2 className="card-title">1</h2>
            <p className="card-text">Upcoming Holidays</p>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  <BellFill className="text-warning me-2" />
                  Notifications
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {notifications.length === 0 ? (
                  <p className="text-center text-muted">No new notifications.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {notifications.map(n => (
                      <li key={n.id} className="list-group-item">
                        <strong>{n.date}</strong>: {n.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-primary" onClick={() => setShowModal(false)}>
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

export default EmployeeDashboard;
