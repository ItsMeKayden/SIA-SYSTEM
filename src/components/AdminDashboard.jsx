import { useState } from 'react';
import '../styles/AdminDashboard.css';
import AdminOrders from './AdminOrders';
import Management from './Management';
import Reports from './Reports';
import Services from './Services';


function AdminDashboard({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState('orders');
  
  // GET ADMIN NAME FROM USER DATA
  const getAdminName = () => {
    if (!userData) return 'Admin';
    
    // Try different possible field names from your database
    return userData.fld_username;
  };


  //USES THE LOGOUT FUNCTION PASSED AS PROP FROM App.JSX
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback if onLogout is not provided
      console.log('Admin logged out');
      window.location.href = '/';
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h2 className="logo">WashTrack Admin</h2>
          <p className="welcome-text">Welcome, {getAdminName()}</p> {/* ✅ USE DYNAMIC NAME */}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <nav className="admin-nav">
        <button
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders
        </button>
        <button
          className={`nav-btn ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => setActiveTab('management')}
        >
          ⚙️ Management
        </button>
        <button
          className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📊 Reports
        </button>
        <button
          className={`nav-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          🔧 Services
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'orders' && <AdminOrders userData={userData} />}
        {activeTab === 'management' && <Management userData={userData} />}
        {activeTab === 'reports' && <Reports userData={userData} />}
        {activeTab === 'services' && <Services userData={userData} />}
      </main>
    </div>
  );
}

export default AdminDashboard;