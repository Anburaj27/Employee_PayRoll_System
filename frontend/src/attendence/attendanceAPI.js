// Dummy API handlers (you must replace these with real API calls)
export const markAttendanceAPI = async ({ employeeId }) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

export const fetchAttendanceListAPI = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          employeeId: 'EMP123',
          date: '2025-05-31',
          time: '09:00 AM',
          status: 'Present',
        },
        {
          id: 2,
          employeeId: 'EMP456',
          date: '2025-05-31',
          time: '09:10 AM',
          status: 'Present',
        },
      ]);
    }, 500);
  });
};
