import '../styles/Sidebar.css';

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span className="nav-icon">📦</span>
          <span className="nav-label">Orders</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          <span className="nav-icon">📍</span>
          <span className="nav-label">Tracking</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
