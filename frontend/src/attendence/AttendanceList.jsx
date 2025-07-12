
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceListRequest } from '../attendence/attendanceSlice';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt, FaUser } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AttendanceList = () => {
  const dispatch = useDispatch();
  const { attendanceList, loading, error } = useSelector((state) => state.attendance);
  const user = useSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchAttendanceListRequest());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, monthFilter, dateFilter, statusFilter]);

  const getMonthName = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, { month: 'long' });

  const isToday = (dateStr) => {
    const today = new Date().toLocaleDateString('en-CA');
    return dateStr === today;
  };

  const isWeekend = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6;
  };

  const filteredList = attendanceList.filter((entry) => {
    if (user?.role !== 'admin' && entry.employeeId !== user?.employeeId) return false;
    const month = getMonthName(entry.date);
    return (
      (!searchTerm ||
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!monthFilter || month === monthFilter) &&
      (!dateFilter || entry.date === dateFilter) &&
      (!statusFilter || entry.status === statusFilter)
    );
  });

  const totalPages = Math.ceil(filteredList.length / rowsPerPage);
  const paginatedData = filteredList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const uniqueMonths = [...new Set(attendanceList.map((e) => getMonthName(e.date)))];

  const exportToCSV = () => {
    const csvData = filteredList.map((entry) => ({
      Date: entry.date,
      Month: getMonthName(entry.date),
      Time: entry.time,
      Status: entry.status,
      Name: entry.name,
      EmployeeID: entry.employeeId,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'attendance.csv';
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = ['Date', 'Month', 'Time', 'Status', 'Name', 'Employee ID'];
    const rows = filteredList.map((entry) => [
      entry.date,
      getMonthName(entry.date),
      entry.time,
      entry.status,
      entry.name,
      entry.employeeId,
    ]);
    doc.text('Attendance Records', 14, 15);
    let y = 25;
    headers.forEach((header, i) => doc.text(header, 14 + i * 30, y));
    y += 10;
    rows.forEach((row) => {
      row.forEach((text, i) => doc.text(String(text), 14 + i * 30, y));
      y += 10;
    });
    doc.save('attendance.pdf');
  };

  return (
    <div className="container py-5" style={{marginLeft:'380px'}}>
      <div className="text-center mb-5" data-aos="fade-down">
        <h2 className="fw-bold display-6 text-primary">📝 Attendance Dashboard</h2>
      </div>

      {/* Employee Calendar */}
      {user?.role === 'employee' && (
        <div className="card shadow-lg mb-5 border-primary rounded-4" data-aos="zoom-in">
          <div className="card-header bg-primary text-white rounded-top">
            <h5 className="mb-0">📅 Attendance Calendar</h5>
          </div>
          <div className="card-body bg-light rounded-bottom">
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              tileContent={({ date, view }) => {
                if (view !== 'month') return null;
                const dateStr = date.toLocaleDateString('en-CA');
                const entry = attendanceList.find(
                  (e) => e.employeeId === user.employeeId && e.date === dateStr
                );
                if (!entry) return null;

                const statusIcon = {
                  Present: <FaCheckCircle color="green" />,
                  Absent: <FaTimesCircle color="red" />,
                  Late: <FaClock color="orange" />,
                };

                return (
                  <div className="text-center mt-1" style={{ fontSize: '0.9em' }}>
                    {statusIcon[entry.status] || <span>-</span>}
                  </div>
                );
              }}
            />
          </div>
        </div>
      )}

      {/* Admin Filters */}
      {user?.role === 'admin' && (
        <>
          <div className="row mb-4" data-aos="fade-up">
            <div className="col-lg-4 mb-3">
              <div className="card h-100 shadow-sm border-info rounded-4">
                <div className="card-body">
                  <h6 className="text-info text-uppercase">Filter by Date</h6>
                  <input
                    type="date"
                    className="form-control rounded-3 shadow-sm border border-primary-subtle"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-8 mb-3">
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control rounded-3 shadow-sm border border-primary-subtle"
                    placeholder="🔍 Search by name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select rounded-3 shadow-sm border border-primary-subtle"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                  >
                    <option value="">🗓️ Filter by Month</option>
                    {uniqueMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select rounded-3 shadow-sm border border-primary-subtle"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">📌 Filter by Status</option>
                    <option value="Present">✅ Present</option>
                    <option value="Absent">❌ Absent</option>
                    <option value="Late">⏰ Late</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4" data-aos="fade-up">
            {['Present', 'Absent', 'Late'].map((status, i) => {
              const count = attendanceList.filter(
                (e) => (!dateFilter || e.date === dateFilter) && e.status === status
              ).length;

              const bg = {
                Present: 'bg-gradient bg-success',
                Absent: 'bg-gradient bg-danger',
                Late: 'bg-gradient bg-warning text-dark',
              };

              return (
                <div className="col-md-4" key={i}>
                  <div className={`card text-white ${bg[status]} shadow-lg rounded-4`}>
                    <div className="card-body text-center">
                      <h6 className="text-uppercase">{status} Records</h6>
                      <h2 className="fw-bold">{count}</h2>
                      <p className="mb-0">{dateFilter || 'All Dates'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-4 d-flex gap-3" data-aos="fade-right">
            <button className="btn btn-outline-success rounded-pill shadow-sm" onClick={exportToCSV}>
              📤 Export Excel
            </button>
            <button className="btn btn-outline-danger rounded-pill shadow-sm" onClick={exportToPDF}>
              🖨️ Export PDF
            </button>
          </div>
        </>
      )}

      {/* Attendance Table */}
      <div className="card shadow-lg border-0 rounded-4" data-aos="fade-up">
        <div className="card-body">
          <h5 className="mb-4 fw-bold text-primary">📊 Attendance Records</h5>

          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary text-uppercase">
                <tr>
                  <th><FaCalendarAlt className="me-1" />Date</th>
                  <th>Month</th>
                  <th><FaClock className="me-1" />Time</th>
                  <th>Status</th>
                  <th><FaUser className="me-1" />Name</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={`${isToday(entry.date) ? 'table-info fw-bold' : ''} ${
                      isWeekend(entry.date) ? 'table-warning' : ''
                    }`}
                  >
                    <td>{entry.date}</td>
                    <td>{getMonthName(entry.date)}</td>
                    <td>{entry.time}</td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          entry.status === 'Present'
                            ? 'bg-success'
                            : entry.status === 'Absent'
                            ? 'bg-danger'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td>{entry.name}</td>
                    <td>{entry.employeeId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <label className="me-2">Rows per page:</label>
              <select
                className="form-select d-inline-block w-auto rounded-3 shadow-sm border border-primary-subtle"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 25, 50].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                  <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                  <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;

