import { call, put, takeLatest } from 'redux-saga/effects';
import {
  signupRequest, signupSuccess, signupFailure,
  loginRequest, loginSuccess, loginFailure,
  fetchEmployeesRequest, fetchEmployeesSuccess, fetchEmployeesFailure,
  deleteEmployeeRequest, deleteEmployeeSuccess, deleteEmployeeFailure,
  updateEmployeeRequest, updateEmployeeSuccess, updateEmployeeFailure,
  getEmployeeByIdRequest, getEmployeeByIdSuccess, getEmployeeByIdFailure,
  toggleEmployeeStatusRequest, toggleEmployeeStatusSuccess, toggleEmployeeStatusFailure,
} from '../Employee/employeeSlice';

import {
  registerUser,
  loginUser,
  fetchEmployeesAPI,
  deleteEmployeeAPI,
  updateEmployeeAPI,
  getEmployeeByIdAPI,
  toggleEmployeeStatusAPI,
} from '../../services/api';


function* handleSignup(action) {
  try {
    const response = yield call(registerUser, action.payload);
    yield put(signupSuccess(response.data));
  } catch (error) {
    yield put(signupFailure(error.response?.data?.message || error.message));
  }
}



function* handleLogin(action) {
  try {
   
    const response = yield call(loginUser, action.payload); 


    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }

    yield put(loginSuccess(user)); 

  } catch (error) {
    console.error('Login error:', error);
    yield put(loginFailure(error.response?.data?.message || error.message));
  }
}


// 🔹 Fetch All Employees
function* handleFetchEmployees() {
  try {
    const response = yield call(fetchEmployeesAPI);
    yield put(fetchEmployeesSuccess(response.data));
  } catch (error) {
    console.error('Fetch employees error:', error);
    yield put(fetchEmployeesFailure(error.response?.data?.message || error.message));
  }
}

// 🔹 Delete Employee
function* handleDeleteEmployee(action) {
  try {
yield call(deleteEmployeeAPI, action.payload); // action.payload must be MongoDB _id

    yield put(deleteEmployeeSuccess(action.payload));
    yield put(fetchEmployeesRequest());
  } catch (error) {
    console.error('Delete employee error:', error);
    yield put(deleteEmployeeFailure(error.response?.data?.message || error.message));
  }
}

// 🔹 Update Employee
function* handleUpdateEmployee(action) {
  try {
    const { id, updatedData } = action.payload;
    
    const response = yield call(updateEmployeeAPI, id, updatedData);
    yield put(updateEmployeeSuccess(response.data));
  } catch (error) {
    console.error('Update employee error:', error);
    yield put(updateEmployeeFailure(error.response?.data?.message || error.message));
  }
}

// 🔹 Get Employee By ID
function* handleGetEmployeeById(action) {
  try {
    const response = yield call(getEmployeeByIdAPI, action.payload);
    yield put(getEmployeeByIdSuccess(response.data));
  } catch (error) {
    console.error('Get employee by ID error:', error);
    yield put(getEmployeeByIdFailure(error.response?.data?.message || error.message));
  }
}

// 🔹 Toggle Active/Inactive Status
function* handleToggleEmployeeStatus(action) {
  try {
    const { id, isActive } = action.payload;

    // Call API
    const response = yield call(toggleEmployeeStatusAPI, id, isActive);

    // Dispatch success
    yield put(toggleEmployeeStatusSuccess(response.data));
  } catch (error) {
    console.error('Toggle status error:', error);

    const errorMsg = error.response?.data?.message || error.message || 'Unknown toggle error';

    // Dispatch failure
    yield put(toggleEmployeeStatusFailure(errorMsg));
  }
}

// 🔁 Root Saga
export default function* employeeSaga() {
  yield takeLatest(signupRequest.type, handleSignup);
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(fetchEmployeesRequest.type, handleFetchEmployees);
  yield takeLatest(deleteEmployeeRequest.type, handleDeleteEmployee);
  yield takeLatest(updateEmployeeRequest.type, handleUpdateEmployee);
  yield takeLatest(getEmployeeByIdRequest.type, handleGetEmployeeById);
  yield takeLatest(toggleEmployeeStatusRequest.type, handleToggleEmployeeStatus);
}


