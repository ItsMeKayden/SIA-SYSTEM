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

  const refreshUserData = (newUserData) => {
    setUserData(newUserData);
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
<<<<<<< HEAD
        <AdminDashboard 
          userData={userData}
          onLogout={handleLogout}
          onRefreshUserData={refreshUserData}
        />
      ) : (
        <Dashboard
          userData={userData}
          onLogout={handleLogout}
          onRefreshUserData={refreshUserData}
        />
=======
        <AdminDashboard userData={userData} onLogout={handleLogout} />
      ) : (
        <Dashboard userData={userData} onLogout={handleLogout} />
>>>>>>> ed41528ff563c688c4c47f299dad5cd31e532bad
      )}
    </>
  );
}

export default App;
