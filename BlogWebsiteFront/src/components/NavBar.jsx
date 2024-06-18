// NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ isAuthenticated, username, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-title">Home</Link>
        {isAuthenticated ? (
          <div className="navbar-right">
            <span className="welcome-msg">Welcome, {username}</span>
            <button className="navbar-button" onClick={onLogout}>Logout</button>
            <Link to="/create-post" className="navbar-button">Create Post</Link>
          </div>
        ) : (
          <div className="navbar-right">
            <Link to="/login" className="navbar-button">Login</Link>
            <Link to="/register" className="navbar-button">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;



