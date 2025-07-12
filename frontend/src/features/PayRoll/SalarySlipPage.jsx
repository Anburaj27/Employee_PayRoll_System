// // SalarySlipPage.jsx
// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import SalarySlip from './SalarySlip'; // Make sure path is correct

// const SalarySlipPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const slipData = location.state?.slipData;

//   if (!slipData) {
//     return <div className="alert alert-warning text-center mt-5">No salary slip data provided.</div>;
//   }

//   return (
//     <SalarySlip
//       data={slipData}
//       onClose={() => navigate(-1)} // Go back to previous page
//     />
//   );
// };

// export default SalarySlipPage;
