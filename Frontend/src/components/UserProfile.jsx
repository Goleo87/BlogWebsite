import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultProfileImage from '../assets/default-profile.png';

const UserProfile = ({ setIsAuthenticated, setUsername, setUserId, setUserImage }) => {
  const [username, setUsernameState] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (id && accessToken) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/users/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUsernameState(data.username);
            setEmail(data.email);
            if (data.profileImage) {
              setProfileImage(data.profileImage);
            }
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          setError(error.message);
        }
      };
      fetchUserData();
    }
  }, [id, accessToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!id) {
      setError('User ID is missing');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      if (password) formData.append('password', password);
      if (profileImage) formData.append('profileImage', profileImage);

      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setUserImage(data.profileImage || defaultProfileImage);
        navigate('/'); // Redirige a la página principal después de actualizar
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      setError('User ID is missing');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUsername('');
        setUserId(null);
        setUserImage(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('userImage');
        navigate('/register'); // Redirige al registro después de eliminar la cuenta
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Update Your Profile</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleUpdate}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsernameState(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Profile Image:
          <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
        </label>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default UserProfile;




