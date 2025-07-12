// src/pages/AdminSignup.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminSignupRequest, clearAuthState } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './AdminSignup.css';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRegistered, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Minimum 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ prevent native form submission
    console.log("Form submit triggered");
    if (validateForm()) {
      console.log("Form validated, dispatching action");
      dispatch(adminSignupRequest(formData));
    } else {
      console.log("Validation failed");
    }
  };

  useEffect(() => {
    if (isRegistered) {
      dispatch(clearAuthState());
      // navigate('/'); // Optional: Navigate after successful registration
    }
  }, [isRegistered, dispatch, navigate]);

  return (
    <form className="signup-container" onSubmit={handleSubmit}>
      <h2>Admin Signup</h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      {errors.password && <p className="error">{errors.password}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default AdminSignup;
