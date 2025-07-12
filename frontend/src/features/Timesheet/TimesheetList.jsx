import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimesheets } from './timesheetSlice';

const TimesheetList = () => {
  const dispatch = useDispatch();
  const { entries = [], loading, error } = useSelector((state) => state.timesheet);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTimesheets());
  }, [dispatch]);

  const filterEntries = () => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = selectedDate ? entry.date === selectedDate : true;

      const matchesMonth = selectedMonth
        ? entry.date?.startsWith(selectedMonth)
        : true;

      return matchesSearch && matchesDate && matchesMonth;
    });
  };

  const filteredEntries = filterEntries();

  // Pagination logic
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
<div className="container py-5" style={{marginLeft:'380px'}}>
      <h4 className="mb-3">Timesheet Entries</h4>

      {/* Filters */}
      <div className="row g-2 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search by Employee ID or Name"
            className="form-control"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset pagination on filter
            }}
          />
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="col-md-4">
          <input
            type="month"
            className="form-control"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center my-4">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">Error: {error}</div>
      ) : filteredEntries.length === 0 ? (
        <div className="alert alert-info">No matching timesheet entries found.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Date</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Project</th>
                  {/* <th>Hours Worked</th> */}
                  <th>Task Description</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((entry) => (
                  <tr key={entry._id || entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.employeeId}</td>
                    <td>{entry.name}</td>
                    <td>{entry.projectName}</td>
                    {/* <td>{entry.hoursWorked} hrs</td> */}
                    <td>{entry.taskDescription}</td>
                    <td>
                      <span
                        className={`badge ${
                          entry.status === 'Completed'
                            ? 'bg-success'
                            : entry.status === 'In Progress'
                            ? 'bg-warning text-dark'
                            : 'bg-secondary'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td>{entry.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default TimesheetList;
