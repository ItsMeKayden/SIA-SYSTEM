import { useState } from 'react';
import '../styles/AdminDashboard.css';
import AdminOrders from './AdminOrders';
import Management from './Management';
import Reports from './Reports';
import Services from './Services';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [adminName] = useState('Admin User');

  const handleLogout = () => {
    console.log('Admin logged out');
    window.location.href = '/';
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h2 className="logo">WashTrack Admin</h2>
          <p className="welcome-text">Welcome, {adminName}</p>
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
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'management' && <Management />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'services' && <Services />}
      </main>
    </div>
  );
}

export default AdminDashboard;
