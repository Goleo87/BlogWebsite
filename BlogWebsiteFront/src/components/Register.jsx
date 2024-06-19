import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';


function Register ({setUserId}) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  async function handleRegister (e) {
    e.preventDefault();
    try {
      const settings = {
        method: "POST",
        body: JSON.stringify({ email, username, password, recaptchaToken}),
        headers: {
          "Content-Type": "application/JSON"
        }
      }
  
      const response = await fetch("http://localhost:5000/register", settings);

    if (response.ok) {
      const newUserData = await response.json();

      // Store token and setUserId
      localStorage.setItem("jwt", newUserData.token);
      setUserId(newUserData.id); // Ensure setUserId is defined and passed correctly

      alert("Registration successful!");
      setIsAuthenticated(true);
          setUsername(userData.username);
          navigate("/")
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
        <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
      
        
        <label htmlFor="username">Username*</label>
        <input type="text" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} />
      
      
        <label htmlFor="password">Password*</label>
        <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
      
        <ReCAPTCHA className='recaptcha'
          sitekey="6Le33_YpAAAAAJfZFlSijhsa70YWxT2beWXENQq8"
          onChange={(token) => setRecaptchaToken(token)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

