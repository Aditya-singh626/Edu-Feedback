import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { getCurrentUser, logoutUser, initializeStorage } from './utils/storage';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeStorage();
    const user = getCurrentUser();
    if (user && user.isLoggedIn) {
      setCurrentUser(user);
    }
    setInitialized(true);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (!initialized) {
    return (
      <div className="app-loading-screen">
        <div className="spinner"></div>
        <p>Loading Faculty Feedback System...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  switch (currentUser.userType) {
    case 'faculty':
      return (
        <FacultyDashboard
          user={currentUser}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      );
    case 'admin':
      return (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      );
    case 'student':
    default:
      return (
        <StudentDashboard
          user={currentUser}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      );
  }
}
