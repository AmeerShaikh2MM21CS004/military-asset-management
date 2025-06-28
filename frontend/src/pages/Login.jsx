import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const getCSRFToken = async () => {
    try {
      await axios.get('http://localhost:8000/api/csrf/', {
        withCredentials: true,
      });
    } catch (error) {
      console.error('CSRF fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await getCSRFToken(); // Get CSRF before login

    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage('Login successful!');
        // redirect to dashboard or store auth info if needed
      }
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
