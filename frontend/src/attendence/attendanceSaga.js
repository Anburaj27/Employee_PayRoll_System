// src/redux/sagas/attendanceSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  markAttendanceRequest,
  markAttendanceSuccess,
  markAttendanceFailure,
  fetchAttendanceListSuccess,
  fetchAttendanceListFailure,
  fetchAttendanceListRequest,
} from '../attendence/attendanceSlice';

import { markAttendanceAPI, fetchAttendanceListAPI } from '../services/api';

function* handleMarkAttendance(action) {
  try {
    const response = yield call(markAttendanceAPI, action.payload);
    yield put(markAttendanceSuccess(response.data));
  } catch (error) {
    yield put(
      markAttendanceFailure(error.response?.data?.message || 'Failed to mark attendance')
    );
  }
}

function* handleFetchAttendanceList() {
  try {
    const response = yield call(fetchAttendanceListAPI);
    yield put(fetchAttendanceListSuccess(response.data));
  } catch (error) {
    yield put(
      fetchAttendanceListFailure(error.response?.data?.message || 'Failed to fetch attendance list')
    );
  }
}

export default function* attendanceSaga() {
  yield takeLatest(markAttendanceRequest.type, handleMarkAttendance);
  yield takeLatest(fetchAttendanceListRequest.type, handleFetchAttendanceList);
}
