import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

function Register({ setUserId, setUsername, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [username, setUsernameLocal] = useState(''); // Renombrado para evitar conflicto
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
      const settings = {
        method: "POST",
        body: JSON.stringify({ email, username, password, recaptchaToken }),
        headers: {
          "Content-Type": "application/json"
        }
      }
      const response = await fetch("http://localhost:5000/register", settings);

      if (response.ok) {
        const newUserData = await response.json();

        // Almacena el token y establece el userId y username
        localStorage.setItem("jwt", newUserData.token);
        localStorage.setItem("username", newUserData.username); // Almacena el nombre de usuario
        localStorage.setItem("userId", newUserData.id); // Almacena el ID del usuario
        setUserId(newUserData.id);
        setUsername(newUserData.username);
        setIsAuthenticated(true);

        alert("Registration successful!");
        navigate("/"); // Redirige a la página de inicio
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
          onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="username">Username*</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={e => setUsernameLocal(e.target.value)}
        />

        <label htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
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


