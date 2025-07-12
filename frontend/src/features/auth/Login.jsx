import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, error, loading } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'admin',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginRequest(credentials));
  };

  useEffect(() => {
    if (user && token) {
      toast.success('Login successful!', { autoClose: 2000 });
      const target =
        user.role === 'admin' ? '/admin/home' : '/Employee/dashboard';
      setTimeout(() => navigate(target, { replace: true }), 2000);
    } else if (error) {
      toast.error('Email or Password mismatch!', {autoClose: 3000});
    }
  }, [user, 
    token, error, navigate]);

  return (
    <>
      <form className="login-container" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Enter email"
          type="email"
          required
          autoFocus
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Enter password"
          type="password"
          required
        />

        <label htmlFor="role">Select Role</label>
        <select
          id="role"
          name="role"
          value={credentials.role}
          onChange={handleChange}
          required
        >
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <ToastContainer position="top-right" />
    </>
  );
};

export default Login;
