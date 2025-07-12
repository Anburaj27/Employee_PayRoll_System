import { createSlice } from '@reduxjs/toolkit';

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState: {
    entries: [],
    loading: false,
    error: null,
    success: false, // ✅ for success feedback (e.g., after submitting form)
  },
  reducers: {
    // 🔄 Fetch Timesheets
    fetchTimesheets: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    fetchTimesheetsSuccess: (state, action) => {
      state.loading = false;
      state.entries = action.payload;
    },
    fetchTimesheetsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ➕ Add Timesheet
    addTimesheet: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    addTimesheetSuccess: (state, action) => {
      state.loading = false;
      state.entries.push(action.payload);
      state.success = true;
    },
    addTimesheetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // 🧹 Clear status for UX (e.g., hide alert after a few seconds)
    clearTimesheetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  fetchTimesheets,
  fetchTimesheetsSuccess,
  fetchTimesheetsFailure,
  addTimesheet,
  addTimesheetSuccess,
  addTimesheetFailure,
  clearTimesheetStatus,
} = timesheetSlice.actions;

export default timesheetSlice.reducer;
