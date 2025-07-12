// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchEmployeeAttendanceRequest } from '../attendence/attendanceSlice';

// const EmployeeAttendanceLog = ({ employeeId }) => {
//   const dispatch = useDispatch();
//   const { employeeAttendance, loading, error } = useSelector(state => state.attendance);

//   useEffect(() => {
//     if (employeeId) {
//       dispatch(fetchEmployeeAttendanceRequest(employeeId));
//     }
//   }, [dispatch, employeeId]);

//   return (
//     <div className="container mt-4">
//       <h3>🧾 Your Attendance History</h3>
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-danger">{error}</p>
//       ) : (
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employeeAttendance.map((record, index) => (
//               <tr key={index}>
//                 <td>{record.date}</td>
//                 <td>{record.time}</td>
//                 <td>{record.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default EmployeeAttendanceLog;
