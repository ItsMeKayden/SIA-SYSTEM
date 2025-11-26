import { useState } from 'react';
import '../styles/Management.css';

function Management() {
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: 'Gyrl Hanahan',
      email: 'gyrlhanahan@gmail.com',
      role: 'Staff',
      status: 'active',
      joinDate: '2025-11-01',
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@washtrack.com',
      role: 'Admin',
      status: 'active',
      joinDate: '2025-10-15',
    },
    {
      id: 3,
      name: 'John Customer',
      email: 'john@example.com',
      role: 'User',
      status: 'active',
      joinDate: '2025-11-05',
    },
    {
      id: 4,
      name: 'Jane User',
      email: 'jane@example.com',
      role: 'User',
      status: 'inactive',
      joinDate: '2025-10-20',
    },
    {
      id: 5,
      name: 'Manager Staff',
      email: 'manager@washtrack.com',
      role: 'Staff',
      status: 'active',
      joinDate: '2025-11-03',
    },
  ]);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAccount = (accountId) => {
    setAccounts(accounts.filter((account) => account.id !== accountId));
  };

  const handleToggleStatus = (accountId) => {
    setAccounts(
      accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              status: account.status === 'active' ? 'inactive' : 'active',
            }
          : account
      )
    );
  };

  const handleChangeRole = (accountId, newRole) => {
    setAccounts(
      accounts.map((account) =>
        account.id === accountId ? { ...account, role: newRole } : account
      )
    );
  };

  return (
    <section className="management-section">
      <div className="section-header">
        <div className="header-content">
          <h3>Admin Management</h3>
          <p>Manage system administrators and staff</p>
        </div>
        <button className="add-admin-btn">➕ Add Admin</button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="management-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td className="name-cell">{account.name}</td>
                <td>{account.email}</td>
                <td>
                  <select
                    className="role-select"
                    value={account.role}
                    onChange={(e) =>
                      handleChangeRole(account.id, e.target.value)
                    }
                  >
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="User">User</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${account.status}`}>
                    {account.status}
                  </span>
                </td>
                <td>{account.joinDate}</td>
                <td className="actions-cell">
                  <button
                    className={`action-btn toggle-btn ${account.status}`}
                    onClick={() => handleToggleStatus(account.id)}
                    title={
                      account.status === 'active' ? 'Deactivate' : 'Activate'
                    }
                  >
                    {account.status === 'active' ? '✓' : '○'}
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteAccount(account.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Management;
