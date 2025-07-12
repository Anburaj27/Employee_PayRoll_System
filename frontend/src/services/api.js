import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ AUTH ROUTES

export const registerUser = async (data) => {
  return API.post('/signup', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
// POST /api/signup

export const loginUser = (data) => API.post('/login', data);               
export const AdminSignupUser = (data) => API.post('/adminSignup', data);   


//Employee Routes

export const fetchEmployeesAPI = () => 
  API.get('/employees');  
export const deleteEmployeeAPI = (id) => 
  API.delete(`/employees/${id}`); 

export const updateEmployeeAPI = (id, data) =>
  API.put(`/employees/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getEmployeeByIdAPI = (id) => 
  API.get(`/employees/${id}`);


export const toggleEmployeeStatusAPI = (id, isActive) =>
  API.patch(`/employees/${id}/status`, { isActive });


// ✅ LEAVE ROUTES

export const applyLeaveAPI = (data) => API.post('/leave/apply', data);                
export const getAllLeavesAPI = () => API.get('/leave/all');                           
export const getEmployeeLeavesAPI = (employeeId) => API.get(`/leave/${employeeId}`);  
export const updateLeaveStatusAPI = (leaveId, status) =>
API.put(`/leave/update-status/${leaveId}`, { status });     

//Attendance Routes

export const markAttendanceAPI = (data) => API.post('/attendance', data);
export const fetchAttendanceListAPI = () => API.get('/attendance');


export const addTimesheetAPI = async (data) => {
  const response = await API.post('/timesheets', data);
  return response.data;
};


// 📤 GET: Fetch All Timesheet Entries
export const fetchTimesheetsAPI = async () => {
  const response = await API.get('/timesheets');
  return response.data;
};


// 🧾 Optional: Get Timesheets by Employee ID
export const fetchTimesheetsByEmployeeIdAPI = async (employeeId) => {
  const response = await API.get(`/timesheets/${employeeId}`);
  return response.data;
};


// ✅ Fetch all payrolls
export const getPayrolls = () => API.get('/payrolls');


// ✅ Submit payroll data (array of records)
export const createPayroll = (data) => API.post('/payrolls', data);
export default API;
