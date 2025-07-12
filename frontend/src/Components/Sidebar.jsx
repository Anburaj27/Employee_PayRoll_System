import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Sidebar = () => {
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
        <i className="bi bi-stack fs-2 mb-1"></i>
        <h4 className="fw-bold">Admin Panel</h4>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/admin/home" className={navLinkClass}>
            <i className="bi bi-house-door-fill me-2"></i>Home
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/employee" end className={navLinkClass}>
            <i className="bi bi-person-plus-fill me-2"></i>New Employee
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/employee/details" className={navLinkClass}>
            <i className="bi bi-person-lines-fill me-2"></i>Employee Details
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/attendance" end className={navLinkClass}>
            <i className="bi bi-pencil-square me-2"></i>Attendance Form
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/attendance/list" className={navLinkClass}>
            <i className="bi bi-card-checklist me-2"></i>Attendance List
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/leaveApprove" className={navLinkClass}>
            <i className="bi bi-calendar2-check-fill me-2"></i>Leave Approve
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/timesheet/list" className={navLinkClass}>
            <i className="bi bi-clock-history me-2"></i>Timesheet List
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/payroll" end className={navLinkClass}>
            <i className="bi bi-cash-stack me-2"></i>Payroll Form
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/payroll/report" end className={navLinkClass}>
            <i className="bi bi-bar-chart-fill me-2"></i>Payroll Report
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

export default Sidebar;
