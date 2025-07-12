
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from './features/auth/Login';
import EmployeeRoutes from './routes/EmployeeRoutes';
import SalarySlip from './features/PayRoll/SalarySlip';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/admin/*' element={<AppRoutes />}></Route>
        <Route path="/salaryslip" element={<SalarySlip />} />
        <Route path="/" element={<Login />}></Route>
        <Route path='/Employee/*' element={<EmployeeRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;

