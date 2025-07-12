const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const timesheetRoutes = require('./routes/timesheetRoutes');
const payrollRoutes = require('./routes/payrollRoutes');;


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', authRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api', payrollRoutes);

app.get('/', (req, res) => {
  res.send('✅ Timesheet Management API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
