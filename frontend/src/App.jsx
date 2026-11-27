import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { getCurrentUser, logoutUser, initializeStorage } from './utils/storage';

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 text-slate-500 text-sm">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
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
