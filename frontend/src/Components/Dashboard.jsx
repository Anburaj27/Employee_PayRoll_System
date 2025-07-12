import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
  Bell,
  Person,
  People,
  CalendarCheck,
  FileEarmarkText,
  HourglassSplit,
} from 'react-bootstrap-icons';

import { fetchAttendanceListRequest } from '../attendence/attendanceSlice';
import { fetchEmployeesRequest } from '../features/Employee/employeeSlice';
import { fetchTimesheets } from '../features/Timesheet/timesheetSlice';
import { fetchLeavesRequest } from '../leaveform/leaveSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { attendanceList } = useSelector((state) => state.attendance);
  const { employees } = useSelector((state) => state.employee);
  const { entries: timesheetEntries = [] } = useSelector((state) => state.timesheet);
  const { leaves = [] } = useSelector((state) => state.leave);

  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState([
    {
      title: 'Total Employees',
      value: 0,
      icon: <People size={32} />,
      bg: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
    },
    {
      title: 'Today Present',
      value: 0,
      icon: <CalendarCheck size={32} />,
      bg: 'linear-gradient(135deg, #11998e, #38ef7d)',
    },
    {
      title: 'Leaves',
      value: 0,
      icon: <HourglassSplit size={32} />,
      bg: 'linear-gradient(135deg, #f7971e, #ffd200)',
    },
    {
      title: 'Total Timesheets',
      value: 0,
      icon: <FileEarmarkText size={32} />,
      bg: 'linear-gradient(135deg, #232526, #414345)',
    },
  ]);

  useEffect(() => {
    dispatch(fetchAttendanceListRequest());
    dispatch(fetchEmployeesRequest());
    dispatch(fetchTimesheets());
    dispatch(fetchLeavesRequest());
  }, [dispatch]);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const todaysPresent = attendanceList.filter(
      (e) => e.date === todayStr && e.status === 'Present'
    ).length;

    const todaysLeaves = leaves.filter(
      (l) =>
        l.status === 'Approved' &&
        new Date(l.startDate).toISOString().split('T')[0] <= todayStr &&
        new Date(l.endDate).toISOString().split('T')[0] >= todayStr
    ).length;

    const totalTimesheets = timesheetEntries.length;

    setStats((prev) =>
      prev.map((stat) => {
        switch (stat.title) {
          case 'Total Employees':
            return { ...stat, value: employees.length };
          case 'Today Present':
            return { ...stat, value: todaysPresent };
          case 'Leaves':
            return { ...stat, value: todaysLeaves };
          case 'Total Timesheets':
            return { ...stat, value: totalTimesheets };
          default:
            return stat;
        }
      })
    );
  }, [attendanceList, employees, timesheetEntries, leaves]);

 useEffect(() => {
  if (!employees.length || !leaves.length) return;

  const pendingLeaves = leaves
    .filter((l) => l.status === 'Pending')
    .map((l, idx) => {
      const emp = employees.find((e) => String(e.id) === String(l.employeeId));
      return {
        id: `leave-${idx}`,
        message: `Leave request from ${emp?.name || `(ID: ${l.employeeId})`}`,
      };
    });

  setNotifications([...pendingLeaves]);
}, [leaves, employees]);


  const handleProfileClick = () => navigate('/admin/signup');

  const handleNotificationsClick = () => {
    if (notifications.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Notifications',
        text: 'You are all caught up!',
      });
      return;
    }

    const htmlContent = notifications
      .map((n) => `<li>${n.message}</li>`)
      .join('');

    Swal.fire({
      title: 'Notifications',
      html: `<ul style="text-align:left; padding-left:20px;">${htmlContent}</ul>`,
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'swal-wide',
      },
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  };

  return (
    <div className="" style={{ marginLeft: '280px', width:'84%' }}>
      {/* Header */}
      <div className="row align-items-center bg-white py-3 border-bottom shadow-sm">
        <div className="col-md-6">
          <h5 className="mb-0">
            {getGreeting()},{' '}
            <span className="text-primary fw-bold">{user?.name || 'User'}</span>
          </h5>
        </div>
        <div className="col-md-6 d-flex gap-4 justify-content-md-end justify-content-start mt-3 mt-md-0">
          <div className="text-center hover-effect" onClick={handleProfileClick}>
            <Person size={20} className="me-1" />
            <span>Profile</span>
          </div>
          <div className="position-relative hover-effect" onClick={handleNotificationsClick}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="card my-4 shadow-sm border-0 company-card">
        <div className="card-body d-flex flex-column flex-md-row align-items-center">
          <img
            src="/images/company-logo.png"
            alt="Company Logo"
            className="me-md-4 mb-3 mb-md-0 rounded-circle shadow"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
          <div>
            <h4 className="mb-1 text-primary fw-bold">Smount Technologies</h4>
            <p className="text-muted fst-italic mb-2">Innovation in Every Byte</p>
            <ul className="list-unstyled mb-0">
              <li>
                <strong>Location:</strong> Arcot, Tamilnadu, India
              </li>
              <li>
                <strong>Website:</strong>{' '}
                <a href="https://smounttech.com" target="_blank" rel="noreferrer">
                  smounttech.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dynamic Stats */}
      <div className="row g-4 mb-5">
        {stats.map((stat, idx) => (
          <div className="col-sm-6 col-md-3" key={idx}>
            <div
              className="card text-white shadow stat-card h-100 border-0"
              style={{ background: stat.bg }}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-light">{stat.title}</h6>
                  <h2 className="fw-bold counter">{stat.value}</h2>
                </div>
                <div className="icon-box">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Styles */}
      <style jsx="true">{`
        .hover-effect:hover {
          color: #0d6efd;
          cursor: pointer;
          transition: 0.2s ease-in-out;
        }
        .stat-card:hover {
          transform: scale(1.02);
          transition: transform 0.2s ease-in-out;
        }
        .icon-box {
          background-color: rgba(255, 255, 255, 0.2);
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .company-card {
          background: linear-gradient(to right, #f8f9fa, #ffffff);
          border-left: 5px solid #0d6efd;
          transition: box-shadow 0.3s ease;
        }
        .company-card:hover {
          box-shadow: 0 0 15px rgba(13, 110, 253, 0.3);
        }
        @media (max-width: 576px) {
          .card-body {
            text-align: center;
          }
          .icon-box {
            margin-top: 10px;
          }
        }
        .swal-wide {
          width: 500px !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
