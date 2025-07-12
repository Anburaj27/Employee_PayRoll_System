import { call, put, takeLatest } from 'redux-saga/effects';

import {
  fetchTimesheets,
  fetchTimesheetsSuccess,
  fetchTimesheetsFailure,
  addTimesheet,
  addTimesheetSuccess,
  addTimesheetFailure,
} from './timesheetSlice';


import API from '../../services/api';
// Base URL configuration (or use a separate api.js file)


// 🔄 Worker Saga: Fetch all timesheets
function* handleFetchTimesheets() {
  try {
    const response = yield call(API.get, '/timesheets');
    yield put(fetchTimesheetsSuccess(response.data));
  } catch (error) {
    yield put(fetchTimesheetsFailure(error.response?.data?.message || error.message));
  }
}

// ➕ Worker Saga: Add a new timesheet entry
function* handleAddTimesheet(action) {
  try {
    const response = yield call(API.post, '/timesheets', action.payload);
    yield put(addTimesheetSuccess(response.data));

    // 🔄 Optionally re-fetch timesheets to keep UI updated
    yield put(fetchTimesheets());
  } catch (error) {
    yield put(addTimesheetFailure(error.response?.data?.message || error.message));
  }
}

// 🎯 Watcher Saga
export default function* timesheetSaga() {
  yield takeLatest(fetchTimesheets.type, handleFetchTimesheets);
  yield takeLatest(addTimesheet.type, handleAddTimesheet);
}
