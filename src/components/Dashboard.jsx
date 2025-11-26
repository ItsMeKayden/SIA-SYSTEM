import { useState } from 'react';
import '../styles/Dashboard.css';
import Sidebar from './Sidebar';
import Orders from './Orders';
import Tracking from './Tracking';
import Profile from './Profile';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [userName] = useState('John Doe');

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logged out');
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h2 className="logo">WashTrack</h2>
          <p className="welcome-text">Welcome, {userName}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-content">
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'tracking' && <Tracking />}
          {activeTab === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
