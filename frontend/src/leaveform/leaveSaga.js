import { call, put, takeLatest } from 'redux-saga/effects';
import {
  applyLeaveRequest,
  applyLeaveSuccess,
  applyLeaveFailure,
  fetchLeavesRequest,
  fetchLeavesSuccess,
  fetchLeavesFailure,
  approveLeaveRequest,
  approveLeaveSuccess,
  approveLeaveFailure,
} from './leaveSlice';
import API from '../services/api';

function* applyLeaveSaga(action) {
  try {
    const response = yield call(() => API.post('/leave/apply', action.payload));
    yield put(applyLeaveSuccess(response.data));
  } catch (error) {
    yield put(applyLeaveFailure(error.response?.data?.message || 'Apply Leave failed'));
  }
}

function* fetchLeavesSaga() {
  try {
    const response = yield call(() => API.get('/leave/all'));
    yield put(fetchLeavesSuccess(response.data));
  } catch (error) {
    yield put(fetchLeavesFailure(error?.response?.data?.message || 'Fetch Leaves failed'));
  }
}

function* approveLeaveSaga(action) {
  try {
    const response = yield call(() =>
      API.put(`/leave/update-status/${action.payload.id}`, { status: action.payload.status })
    );
    yield put(approveLeaveSuccess(response.data));
    yield put(fetchLeavesRequest());
  } catch (error) {
    yield put(approveLeaveFailure(error?.response?.data?.message || 'Approve Leave failed'));
  }
}

export default function* leaveWatcherSaga() {
  yield takeLatest(applyLeaveRequest.type, applyLeaveSaga);
  yield takeLatest(fetchLeavesRequest.type, fetchLeavesSaga);
  yield takeLatest(approveLeaveRequest.type, approveLeaveSaga);
}

