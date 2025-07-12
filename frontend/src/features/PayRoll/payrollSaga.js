// src/features/payroll/payrollSaga.js
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import {
  fetchPayrolls,
  fetchPayrollsSuccess,
  fetchPayrollsFailure,
  addPayroll,
  addPayrollSuccess,
  addPayrollFailure,
} from './payrollSlice';
import { getPayrolls, createPayroll } from '../../services/api';

function* handleFetchPayrolls() {
  try {
    const res = yield call(getPayrolls);
    yield put(fetchPayrollsSuccess(res.data));
  } catch (err) {
    yield put(fetchPayrollsFailure(err?.response?.data?.error || err.message));
  }
}


function* handleAddPayroll(action) {
  try {
    const res = yield call(createPayroll, action.payload.payrolls);
    yield put(addPayrollSuccess(res.data));
  } catch (err) {
    yield put(addPayrollFailure(err?.response?.data?.error || err.message));
  }
}

export default function* payrollSaga() {
  yield takeLatest(fetchPayrolls.type, handleFetchPayrolls);
  yield takeEvery(addPayroll.type, handleAddPayroll);
}
