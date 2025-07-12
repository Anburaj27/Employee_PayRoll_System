import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaves: [],
  loading: false,
  error: null,
  successMessage: null,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    applyLeaveRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    applyLeaveSuccess: (state, action) => {
      state.loading = false;
      state.leaves.push(action.payload);
      state.successMessage = 'Leave applied successfully!';
    },
    applyLeaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null;
    },

    fetchLeavesRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    fetchLeavesSuccess: (state, action) => {
      state.loading = false;
      state.leaves = action.payload;
      state.successMessage = null;
    },
    fetchLeavesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null;
    },

    approveLeaveRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    approveLeaveSuccess: (state, action) => {
      state.loading = false;
      const { id, status } = action.payload;
      const index = state.leaves.findIndex((leave) => leave.id === id || leave._id === id);
      if (index !== -1) {
        state.leaves[index].status = status;
      }
      state.successMessage = `Leave ${status.toLowerCase()} successfully!`;
    },
    approveLeaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null;
    },

    clearLeaveMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  applyLeaveRequest,
  applyLeaveSuccess,
  applyLeaveFailure,
  fetchLeavesRequest,
  fetchLeavesSuccess,
  fetchLeavesFailure,
  approveLeaveRequest,
  approveLeaveSuccess,
  approveLeaveFailure,
  clearLeaveMessage,
} = leaveSlice.actions;

export default leaveSlice.reducer;