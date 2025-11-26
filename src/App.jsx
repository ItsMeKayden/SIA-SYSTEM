import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleSwitchToRegister = () => {
    setCurrentPage('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = (isAdmin = false) => {
    if (isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  return (
    <>
      {currentPage === 'login' ? (
        <Login
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : currentPage === 'register' ? (
        <Register onSwitchToLogin={handleSwitchToLogin} />
      ) : currentPage === 'admin' ? (
        <AdminDashboard />
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;
