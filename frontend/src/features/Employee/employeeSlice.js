import { createSlice } from '@reduxjs/toolkit';

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isRegistered: false,
    employees: [],
    selectedEmployee: null,
  },
  reducers: {
    // 🔹 Signup
    signupRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.isRegistered = true;
      state.user = action.payload;
    },
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Login
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.selectedEmployee = null;
      state.isRegistered = false;
    },

    // 🔹 Fetch Employees
    fetchEmployeesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.employees = action.payload;
    },
    fetchEmployeesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Delete
 deleteEmployeeRequest: (state) => {
  state.loading = true;
  state.error = null; // Clear previous errors
},

    deleteEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.employees = state.employees.filter(emp => emp._id !== action.payload);
    },
    deleteEmployeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Update
    updateEmployeeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEmployeeSuccess: (state, action) => {
      state.loading = false;
      state.isRegistered = true;
      const updated = action.payload;
      state.employees = state.employees.map(emp =>
        emp._id === updated._id ? updated : emp
      );
    },
    updateEmployeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Get By ID
    getEmployeeByIdRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEmployeeByIdSuccess: (state, action) => {
      state.loading = false;
      state.selectedEmployee = action.payload;
    },
    getEmployeeByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },

    // 🔹 Toggle Active/Inactive
    toggleEmployeeStatusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    toggleEmployeeStatusSuccess: (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.employees = state.employees.map(emp =>
        emp._id === updated._id ? updated : emp
      );
    },
    toggleEmployeeStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Clear Everything
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.isRegistered = false;
      state.user = null;
      state.token = null;
      state.selectedEmployee = null;
    },
  },
});

export const {
  signupRequest,
  signupSuccess,
  signupFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  deleteEmployeeRequest,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  updateEmployeeRequest,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  getEmployeeByIdRequest,
  getEmployeeByIdSuccess,
  getEmployeeByIdFailure,
  clearSelectedEmployee,
  toggleEmployeeStatusRequest,
  toggleEmployeeStatusSuccess,
  toggleEmployeeStatusFailure,
  clearAuthState,
} = employeeSlice.actions;

export default employeeSlice.reducer;
