import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signupRequest,
  updateEmployeeRequest,
  getEmployeeByIdRequest,
  clearAuthState,
} from '../Employee/employeeSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Barcode from 'react-barcode';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';

const EmployeeSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const { selectedEmployee, isRegistered, loading, error } = useSelector((state) => state.employee);

  const isEditMode = Boolean(employeeId);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    department: '',
    designation: '',
    joiningDate: '',
    address: '',
    gender: '',
    role: 'employee',
    employeeId: '',
    profileImage: '',
    salary: '',
  });

  const softwareDesignations = [
    'Frontend Developer', 'Software Developer', 'Python Developer',
    'Backend Developer', 'Fullstack Developer', 'QA Engineer',
    'DevOps Engineer', 'UI/UX Designer'
  ];
  const teklaDesignations = ['Structural Modeler', 'Steel Detailer', 'Tekla Checker'];

  useEffect(() => {
    if (isEditMode) {
      dispatch(getEmployeeByIdRequest(employeeId));
    }
  }, [isEditMode, employeeId, dispatch]);

  useEffect(() => {
    if (isEditMode && selectedEmployee) {
      setFormData({
        ...selectedEmployee,
        phone: selectedEmployee.phone?.replace('+', '') || '',
        password: '',
        salary: selectedEmployee.salary || '',
      });
      setImagePreview(
        selectedEmployee?.profileImage ? `${BASE_URL}${selectedEmployee.profileImage}` : ''
      );
    }
  }, [isEditMode, selectedEmployee, BASE_URL]);

  useEffect(() => {
    if (isRegistered) {
      toast.success(isEditMode ? 'Employee updated successfully!' : 'Employee registered successfully!', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });

      setTimeout(() => {
        dispatch(clearAuthState());
        navigate('/admin/employee/details');
      }, 1500);
    }
  }, [isRegistered, dispatch, navigate, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'department' ? { designation: '' } : {}),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getDesignationOptions = () => {
    if (formData.department === 'Software') return softwareDesignations;
    if (formData.department === 'Tekla') return teklaDesignations;
    return [];
  };

  const today = new Date().toISOString().split('T')[0];
  const getEighteenYearsAgo = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const normalizedPhone = formData.phone.replace(/\D/g, '');

    const dobDate = new Date(formData.dob);
    const joiningDate = new Date(formData.joiningDate);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!isEditMode && !formData.password.trim()) newErrors.password = 'Password is required';
    if (!/^91\d{10}$/.test(normalizedPhone)) newErrors.phone = 'Valid Indian phone number required';
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    } else if (age < 18) {
      newErrors.dob = 'Employee must be at least 18 years old';
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining Date is required';
    } else {
      if (joiningDate < dobDate) newErrors.joiningDate = 'Joining date must be after date of birth';
      if (joiningDate > currentDate) newErrors.joiningDate = 'Joining date cannot be in the future';
    }

    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const submissionData = new FormData();
    const payload = { ...formData, phone: `+${formData.phone}` };

    for (let key in payload) {
      if (payload[key]) {
        submissionData.append(key, payload[key]);
      }
    }

    if (imageFile) {
      submissionData.append('profileImage', imageFile);
    }

    if (isEditMode) {
      if (!formData.password) submissionData.delete('password');
      dispatch(updateEmployeeRequest({ id: employeeId, updatedData: submissionData }));
    } else {
      dispatch(signupRequest(submissionData));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="py-5" style={{ marginLeft: '380px', width: '74%' }}>
        <div className="card shadow p-4">
          <h3 className="text-center mb-4">{isEditMode ? 'Edit Employee' : 'Employee Registration'}</h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              {[{ label: 'Name', name: 'name', type: 'text' }, { label: 'Email', name: 'email', type: 'email' }].map(({ label, name, type }) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                  />
                  {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
                </div>
              ))}

              {!isEditMode && (
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                </div>
              )}

              {isEditMode && showPasswordField && (
                <div className="col-md-6">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}

              {isEditMode && !showPasswordField && (
                <div className="col-md-6 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => setShowPasswordField(true)}
                  >
                    Change Password
                  </button>
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <PhoneInput
                  country={'in'}
                  onlyCountries={['in']}
                  enableSearch
                  value={formData.phone}
                  onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                  inputClass={errors.phone ? 'is-invalid' : ''}
                  inputStyle={{ width: '100%' }}
                />
                {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  max={getEighteenYearsAgo()}
                  onChange={handleChange}
                  className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                />
                {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="Software">Software</option>
                  <option value="Tekla">Tekla</option>
                </select>
                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Designation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={!formData.department}
                  className={`form-select ${errors.designation ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Designation</option>
                  {getDesignationOptions().map((des) => (
                    <option key={des} value={des}>{des}</option>
                  ))}
                </select>
                {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  min={formData.dob || '1900-01-01'}
                  max={today}
                  className={`form-control ${errors.joiningDate ? 'is-invalid' : ''}`}
                />
                {errors.joiningDate && <div className="invalid-feedback">{errors.joiningDate}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                />
                {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
                {imagePreview && <img src={imagePreview} alt="Preview" className="img-thumbnail mt-2" width="100" />}
              </div>

              <div className="col-md-12">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              {error && (
                <div className="col-12">
                  <div className="alert alert-danger">{error}</div>
                </div>
              )}

              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (isEditMode ? 'Updating...' : 'Registering...') : isEditMode ? 'Update Employee' : 'Register'}
                </button>
              </div>
            </div>
          </form>

          {isEditMode && formData.employeeId && (
            <div className="mt-4 text-center">
              <h5>Employee ID Barcode</h5>
              <p>{formData.employeeId}</p>
              <Barcode value={formData.employeeId} width={2} height={80} fontSize={16} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeSignup;
