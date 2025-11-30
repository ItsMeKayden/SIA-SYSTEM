import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { Toast } from './components/Toast';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userData, setUserData] = useState(null);

  const handleSwitchToRegister = () => {
    setCurrentPage('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = (isAdmin = false, user = null) => {
    setUserData(user);

    if (isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentPage('login');
    setUserData(null);
  };

  return (
    <>
      <Toast />
      {currentPage === 'login' ? (
        <Login
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : currentPage === 'register' ? (
        <Register onSwitchToLogin={handleSwitchToLogin} />
      ) : currentPage === 'admin' ? (
        <AdminDashboard userData={userData} onLogout={handleLogout} />
      ) : (
        <Dashboard userData={userData} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
