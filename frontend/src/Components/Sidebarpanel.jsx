import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const Sidebarpanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "nav-link active text-white bg-gradient bg-primary mb-2 rounded-3 shadow"
      : "nav-link text-light mb-2 rounded-3 hover-effect";

  return (
    <div
      className="d-flex flex-column p-3 text-light shadow-lg"
      style={{
        width: '260px',
        background: 'linear-gradient(160deg, #4e54c8, #8f94fb)',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 1040, // optional: makes sure it stays on top of other content
      }}
    >
      <div className="text-center mb-4">
        <i className="bi bi-people-fill fs-2 mb-1"></i>
        <h5 className="fw-bold">Employee Panel</h5>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/Employee/dashboard" className={navLinkClass}>
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/Employee/attendance/list" className={navLinkClass}>
            <i className="bi bi-card-checklist me-2"></i>Attendance Details
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/Employee/leaveForm" className={navLinkClass}>
            <i className="bi bi-envelope-open me-2"></i>Leave Form
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/Employee/timesheet/entry" className={navLinkClass}>
            <i className="bi bi-pencil-square me-2"></i>Timesheet Entry
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto pt-4 border-top border-light-subtle">
        <button className="btn btn-outline-light w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebarpanel;
