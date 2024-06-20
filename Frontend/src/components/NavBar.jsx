import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfileImage from '../assets/default-profile.png'; // Importar imagen por defecto

const NavBar = ({ isAuthenticated, username, onLogout, userImage }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-title">WebDev</Link>
        {isAuthenticated ? (
          <div className="navbar-right">
            <Link to="/user-profile" className="navbar-profile-link">
              <img
                src={userImage || defaultProfileImage}
                alt="User"
                className="navbar-profile-image"
              />
              <span className="welcome-msg">Welcome {username}</span>
            </Link>
            <button className="navbar-button" onClick={onLogout}>Logout</button>
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
