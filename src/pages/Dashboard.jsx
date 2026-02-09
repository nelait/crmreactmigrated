import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className='dashboard'>
      <h1>Welcome back, {user ? user.name : 'User'}!</h1>
      {/* Additional dashboard components and stats go here */}
    </div>
  );
};

export default Dashboard;
