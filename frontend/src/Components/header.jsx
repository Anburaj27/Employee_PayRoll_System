// Header.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Header.css'; // optional for styling

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="header">
      <h1>My App</h1>
      {user ? (
        <div className="user-info">
          <span>Hi, {user.name || user.email}</span>
          {/* Optionally show a profile icon or dropdown here */}
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
};

export default Header;
