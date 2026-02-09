import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';
import Deals from './pages/Deals';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/deals' element={<Deals />} />
          <Route path='/contacts' element={<Contacts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
