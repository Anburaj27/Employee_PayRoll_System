// import { createSlice, createAction } from '@reduxjs/toolkit';

// // ✅ Manual saga trigger for fetching attendance list
// export const fetchAttendanceListRequest = createAction('attendance/fetchAttendanceListRequest');

// const attendanceSlice = createSlice({
//   name: 'attendance',
//   initialState: {
//     attendanceList: [],
//     loading: false,
//     error: null,
//     status: null,  // for optional face attendance or result status display
//   },
//   reducers: {
//     // ---- Attendance Marking ----
//     markAttendanceRequest(state, action) {
//       state.loading = true;
//       state.error = null;
//       state.status = null;
//     },
//     markAttendanceSuccess(state, action) {
//       state.loading = false;
//       state.status = 'Present';
//       state.attendanceList.push(action.payload);
//     },
//     markAttendanceFailure(state, action) {
//       state.loading = false;
//       state.status = 'Failed';
//       state.error = action.payload;
//     },

//     // ---- Attendance List Fetching ----
//     fetchAttendanceListSuccess(state, action) {
//       state.loading = false;
//       state.attendanceList = action.payload;
//     },
//     fetchAttendanceListFailure(state, action) {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     // Optional: Clear status (for face UI reset)
//     clearAttendanceStatus(state) {
//       state.status = null;
//       state.error = null;
//     },
//   },
// });

// export const {
//   markAttendanceRequest,
//   markAttendanceSuccess,
//   markAttendanceFailure,
//   fetchAttendanceListSuccess,
//   fetchAttendanceListFailure,
//   clearAttendanceStatus,
// } = attendanceSlice.actions;

// export default attendanceSlice.reducer;


import { createSlice, createAction } from '@reduxjs/toolkit';

// ✅ Saga triggers
export const fetchAttendanceListRequest = createAction('attendance/fetchAttendanceListRequest');
export const fetchEmployeeAttendanceRequest = createAction('attendance/fetchEmployeeAttendanceRequest');

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendanceList: [],      // Holds all attendance records
    loading: false,          // UI loading state
    error: null,             // API error
    status: null,            // Status of markAttendance (e.g., "Present", "Failed")
  },
  reducers: {
    // ✅ Mark Attendance
    markAttendanceRequest(state) {
      state.loading = true;
      state.error = null;
      state.status = null;
    },
    markAttendanceSuccess(state, action) {
      state.loading = false;
      state.status = 'Present';  // You may customize this if dynamic
      state.attendanceList.push(action.payload);
    },
    markAttendanceFailure(state, action) {
      state.loading = false;
      state.status = 'Failed';
      state.error = action.payload;
    },

    // ✅ Fetch Full Attendance List (Admin or Date Based)
    fetchAttendanceListSuccess(state, action) {
      state.loading = false;
      state.attendanceList = action.payload;
    },
    fetchAttendanceListFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ Clear UI Status (for reset or Face UI)
    clearAttendanceStatus(state) {
      state.status = null;
      state.error = null;
    },
  },
});

export const {
  markAttendanceRequest,
  markAttendanceSuccess,
  markAttendanceFailure,
  fetchAttendanceListSuccess,
  fetchAttendanceListFailure,
  clearAttendanceStatus,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;

