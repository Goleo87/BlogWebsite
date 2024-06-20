import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import defaultProfileImage from '../assets/default-profile.png'; // Importar imagen por defecto

function Register({ setUserId, setUsername, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [username, setUsernameLocal] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('profileImage', defaultProfileImage); // Imagen por defecto

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const newUserData = await response.json();

        localStorage.setItem("accessToken", newUserData.accessToken);
        localStorage.setItem("username", newUserData.username);
        localStorage.setItem("userId", newUserData.id);
        localStorage.setItem("userImage", newUserData.profileImage || defaultProfileImage); // Almacena la imagen por defecto si no hay una imagen personalizada

        setUserId(newUserData.id);
        setUsername(newUserData.username);
        setIsAuthenticated(true);

        alert("Registration successful!");
        navigate("/"); // Redirige a la página principal después del registro
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="container">
      <form className="form" onSubmit={handleRegister}>
        <label htmlFor="email">Email*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="username">Username*</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsernameLocal(e.target.value)}
        />

        <label htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ReCAPTCHA
          className='recaptcha'
          sitekey="6Le33_YpAAAAAJfZFlSijhsa70YWxT2beWXENQq8"
          onChange={(token) => setRecaptchaToken(token)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;




