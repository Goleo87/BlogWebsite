import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PostCreate from './components/PostCreate';
import PostEdit from './components/PostEdit';
import PostDelete from './components/PostDelete';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import UserProfile from './components/UserProfile';
import { isTokenValid, refreshToken } from './utils/auth';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUsername = localStorage.getItem('username');
      const storedUserId = localStorage.getItem('userId');
      const storedUserImage = localStorage.getItem('userImage');
      if (token && isTokenValid(token) && storedUsername && storedUserId) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
        setUserId(storedUserId);
        setUserImage(storedUserImage);
      } else if (token && storedUsername && storedUserId) {
        const success = await refreshToken();
        if (success) {
          setIsAuthenticated(true);
          setUsername(storedUsername);
          setUserId(storedUserId);
          setUserImage(storedUserImage);
        } else {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setUserId(null);
    setUserImage(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userImage');
  };

  return (
    <Router>
      <NavBar
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={handleLogout}
        userImage={userImage}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
              setUsername={setUsername}
              setUserId={setUserId}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              setUserId={setUserId}
              setIsAuthenticated={setIsAuthenticated}
              setUsername={setUsername}
            />
          }
        />
        <Route path="/create-post" element={<PostCreate />} />
        <Route path="/edit-post/:id" element={<PostEdit userId={userId} />} />
        <Route path="/delete-post/:id" element={<PostDelete userId={userId} />} />
        <Route
          path="/user-profile"
          element={
            <UserProfile
              setIsAuthenticated={setIsAuthenticated}
              setUsername={setUsername}
              setUserImage={setUserImage}
              setUserId={setUserId}
            />
          }
        />
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;











