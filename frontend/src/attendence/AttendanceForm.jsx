
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAttendanceRequest } from '../attendence/attendanceSlice';
import { fetchEmployeesRequest } from '../features/Employee/employeeSlice';
import BarcodeScanner from './BarcodeScanner'; // Ensure this file exists
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceForm = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);
  const { status, error } = useSelector((state) => state.attendance);

  const [barcode, setBarcode] = useState('');
  const [formData, setFormData] = useState(null);

  // 🔃 Fetch employee list on component mount
  useEffect(() => {
    dispatch(fetchEmployeesRequest());
  }, [dispatch]);

  // 🔍 When barcode is scanned
  useEffect(() => {
    if (barcode) {
      const matchedEmployee = employees.find(emp => emp.employeeId === barcode);
      if (matchedEmployee) {
        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

        let attendanceStatus = 'Absent';
        if (currentTimeInMinutes <= 570) {
          attendanceStatus = 'Present';
        } else if (currentTimeInMinutes <= 720) {
          attendanceStatus = 'Half Day';
        } else {
          attendanceStatus = 'Late';
        }

        const data = {
          employeeId: matchedEmployee.employeeId,
          name: matchedEmployee.name,
          date: now.toISOString().split('T')[0],
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          photo: '',
          status: attendanceStatus,
        };

        setFormData(data);
      }
    }
  }, [barcode, employees]);

  // ✅ Automatically mark attendance when formData is set
  useEffect(() => {
    if (formData?.employeeId) {
      dispatch(markAttendanceRequest(formData));
      playBeep();

      // ✅ Show toast success message
      toast.success(`✅ Attendance marked for ${formData.name} (ID: ${formData.employeeId})`);

      // 🕒 Reset form after 3 seconds
      const timer = setTimeout(() => {
        setFormData(null);
        setBarcode('');
      }, 3000);

      return () => clearTimeout(timer); // Clean up
    }
  }, [formData, dispatch]);

  // 🔊 Optional: Play success beep
  const playBeep = () => {
    const beep = new Audio('https://www.soundjay.com/buttons/beep-07.wav');
    beep.play().catch((e) => console.warn('Beep error:', e));
  };

  return (
   <div className="container py-5" style={{marginLeft:'380px'}}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center mb-3">📷 Scan Barcode to Mark Attendance</h3>

            <BarcodeScanner onDetected={(code) => setBarcode(code)} />

            {formData && (
              <div className="mt-4">
                <div className="mb-2">
                  <label>Employee ID</label>
                  <input className="form-control" value={formData.employeeId} readOnly />
                </div>

                <div className="mb-2">
                  <label>Name</label>
                  <input className="form-control" value={formData.name} readOnly />
                </div>

                <div className="mb-2">
                  <label>Date</label>
                  <input className="form-control" value={formData.date} readOnly />
                </div>

                <div className="mb-2">
                  <label>Time</label>
                  <input className="form-control" value={formData.time} readOnly />
                </div>
              </div>
            )}

            {status === 'loading' && (
              <p className="text-info text-center mt-2">⏳ Marking attendance...</p>
            )}

            {status === 'succeeded' && formData && (
              <p className="text-success text-center mt-2">
                 Attendance Marked as <strong>{formData.status}</strong>
              </p>
            )}

            {error && <p className="text-danger text-center mt-2">{error}</p>}
          </div>
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AttendanceForm;



