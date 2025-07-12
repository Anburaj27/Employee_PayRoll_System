import { call, put, takeLatest } from 'redux-saga/effects';
import { loginRequest, loginSuccess, loginFailure,adminSignupFailure,adminSignupRequest,adminSignupSuccess } from './authSlice';
import {  loginUser, AdminSignupUser } from '../../services/api';


function* handleAdminSignup(action) {
  try {

    const response = yield call(AdminSignupUser, action.payload);
    yield put(adminSignupSuccess(response.data));
  } catch (error) {
    yield put(adminSignupFailure(error.response?.data?.message || error.message));
  }
}


function* handleLogin(action) {
  try {
    const response = yield call(loginUser, action.payload);
    yield put(loginSuccess(response.data));
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
  } catch (error) {
    yield put(loginFailure(error.response?.data?.message || error.message));
  }
}

export default function* authSaga() {
   yield takeLatest(adminSignupRequest.type, handleAdminSignup);

  yield takeLatest(loginRequest.type, handleLogin);
}
