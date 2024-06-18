import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Login = ({ setIsAuthenticated, setUsername }) => {
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA");
   
    } else {
      try {
        const settings = {
          method: "POST",
          body: JSON.stringify({ username, password, recaptchaToken }),
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await fetch("http://localhost:5000/login", settings);

        if (response.ok) {
          const userData = await response.json();
          localStorage.setItem("accessToken", userData.accessToken);
          localStorage.setItem("refreshToken", userData.refreshToken);
          localStorage.setItem("username", userData.username);

          setIsAuthenticated(true);
          setUsername(userData.username);
          navigate("/"); // Redirect to the main page
        } else {
          throw new Error("Login unsuccessful - please try again");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleLogin}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setLocalUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <ReCAPTCHA
          sitekey="6Le33_YpAAAAAJfZFlSijhsa70YWxT2beWXENQq8"
          onChange={(token) => setRecaptchaToken(token)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
