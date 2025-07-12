
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import authReducer from '../features/auth/authSlice';
import attendanceReducer from '../attendence/attendanceSlice';
import leaveReducer from '../leaveform/leaveSlice';
import timesheetReducer from '../features/Timesheet/timesheetSlice';
import employeeReducer from '../features/Employee/employeeSlice';
import payrollReducer from '../features/PayRoll/payrollSlice';

import rootSaga from '../sagas/rootsaga';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'], 
};


const persistedAuthReducer = persistReducer(persistConfig, authReducer);


const sagaMiddleware = createSagaMiddleware();


const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  attendance: attendanceReducer,
  leave: leaveReducer,
  timesheet: timesheetReducer,
  employee: employeeReducer,
  payroll: payrollReducer,
});


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);


export const persistor = persistStore(store);


export default store;
