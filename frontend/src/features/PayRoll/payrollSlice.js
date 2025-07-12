import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payrolls: [],
  loading: false,
  error: null,
  hasSubmitted: false,
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    fetchPayrolls: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPayrollsSuccess: (state, action) => {
      state.loading = false;
      state.payrolls = action.payload;
    },
    fetchPayrollsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addPayroll: (state) => {
      state.loading = true;
      state.error = null;
      state.hasSubmitted = false;
    },
    addPayrollSuccess: (state, action) => {
      state.loading = false;
      state.hasSubmitted = true;
      state.payrolls = [...state.payrolls, ...action.payload];
    },
    addPayrollFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.hasSubmitted = false;
    },

    resetPayrollError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchPayrolls,
  fetchPayrollsSuccess,
  fetchPayrollsFailure,
  addPayroll,
  addPayrollSuccess,
  addPayrollFailure,
  resetPayrollError,
} = payrollSlice.actions;

export default payrollSlice.reducer;
