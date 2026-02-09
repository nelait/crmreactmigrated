import React, { useState } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/settings/update_profile', { name, email });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      await axios.post('/api/settings/change_password', { currentPassword, newPassword });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className='settings'>
      <h1>Settings</h1>
      <form onSubmit={handleProfileUpdate}>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Full Name' required />
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
        <button type='submit'>Update Profile</button>
      </form>
      <form onSubmit={handlePasswordChange}>
        <input type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder='Current Password' required />
        <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' required />
        <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm New Password' required />
        <button type='submit'>Change Password</button>
      </form>
    </div>
  );
};

export default Settings;
