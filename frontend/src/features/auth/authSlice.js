import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isRegistered: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

        adminSignupRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminSignupSuccess: (state) => {
      state.loading = false;
      state.isRegistered = true;
    },
    adminSignupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearAuthState: (state) => {
      state.isRegistered = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading=false;
      localStorage.removeItem('token');
    },
  },
});

export const {
  adminSignupRequest,
  adminSignupSuccess,
  adminSignupFailure,

  loginRequest,
  loginSuccess,
  loginFailure,
  clearAuthState,
  logout,
} = authSlice.actions;

export default authSlice.reducer;