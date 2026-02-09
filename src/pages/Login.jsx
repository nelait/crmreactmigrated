import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/login', { username, password });
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Login failed!');
    }
  };

  return (
    <div className='login'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' required />
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
