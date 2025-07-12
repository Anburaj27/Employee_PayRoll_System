// src/sagas/rootsaga.js

import { all } from 'redux-saga/effects';
import authSaga from '../features/auth/authSaga';
import attendanceSaga from '../attendence/attendanceSaga';
import leaveSaga from '../leaveform/leaveSaga';
import timesheetSaga from '../features/Timesheet/timesheetSaga';
import employeeSaga from '../features/Employee/employeeSaga';
import payrollSaga from '../features/PayRoll/payrollSaga';


export default function* rootSaga() {
  yield all([
    authSaga(),
    attendanceSaga(),
    leaveSaga(),
    timesheetSaga(),
    employeeSaga(),
    payrollSaga
   
  ]);
}

