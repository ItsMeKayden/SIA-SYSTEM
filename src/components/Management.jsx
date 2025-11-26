import { useState } from 'react';
import '../styles/Management.css';

function Management() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewAccount, setViewAccount] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    username: '',
    contact: '',
    role: 'Staff',
  });
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: 'Gyrl Hanahan',
      email: 'gyrlhanahan@gmail.com',
      username: 'gyrlh_admin',
      contact: '+1-555-0101',
      role: 'Staff',
      status: 'active',
      joinDate: '2025-11-01',
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@washtrack.com',
      username: 'admin_user',
      contact: '+1-555-0102',
      role: 'Admin',
      status: 'active',
      joinDate: '2025-10-15',
    },
    {
      id: 3,
      name: 'John Customer',
      email: 'john@example.com',
      username: 'john_cust',
      contact: '+1-555-0103',
      role: 'User',
      status: 'active',
      joinDate: '2025-11-05',
    },
    {
      id: 4,
      name: 'Jane User',
      email: 'jane@example.com',
      username: 'jane_user',
      contact: '+1-555-0104',
      role: 'User',
      status: 'inactive',
      joinDate: '2025-10-20',
    },
    {
      id: 5,
      name: 'Manager Staff',
      email: 'manager@washtrack.com',
      username: 'manager_staff',
      contact: '+1-555-0105',
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
    setDeleteConfirm(accountId);
  };

  const confirmDelete = (accountId) => {
    setAccounts(accounts.filter((account) => account.id !== accountId));
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleViewAccount = (account) => {
    setViewAccount(account);
  };

  const handleCloseView = () => {
    setViewAccount(null);
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

  const handleAddAdminClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setNewAdminForm({
      name: '',
      email: '',
      username: '',
      contact: '',
      role: 'Staff',
    });
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setNewAdminForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitAddAdmin = (e) => {
    e.preventDefault();
    if (
      newAdminForm.name &&
      newAdminForm.email &&
      newAdminForm.username &&
      newAdminForm.contact
    ) {
      const newAdmin = {
        id: Math.max(...accounts.map((a) => a.id), 0) + 1,
        ...newAdminForm,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
      };
      setAccounts([...accounts, newAdmin]);
      handleCloseAddForm();
    }
  };

  return (
    <section className="management-section">
      <div className="section-header">
        <div className="header-content">
          <h3>Admin Management</h3>
          <p>Manage system administrators and staff</p>
        </div>
        <button className="add-admin-btn" onClick={handleAddAdminClick}>
          ➕ Add Admin
        </button>
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
                    className="action-btn view-btn"
                    onClick={() => handleViewAccount(account)}
                    title="View"
                  >
                    👁️
                  </button>
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

      {deleteConfirm && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Delete Account</h3>
            <p>
              Are you sure you want to delete this account? This action cannot
              be undone.
            </p>
            <div className="confirmation-actions">
              <button className="btn-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={() => confirmDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewAccount && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Account Details</h3>
              <button className="close-btn" onClick={handleCloseView}>
                ✕
              </button>
            </div>

            <div className="account-details">
              <div className="detail-group">
                <label>Username</label>
                <p>{viewAccount.username}</p>
              </div>

              <div className="detail-group">
                <label>Full Name</label>
                <p>{viewAccount.name}</p>
              </div>

              <div className="detail-group">
                <label>Email</label>
                <p>{viewAccount.email}</p>
              </div>

              <div className="detail-group">
                <label>Contact Number</label>
                <p>{viewAccount.contact}</p>
              </div>

              <div className="detail-group">
                <label>Role</label>
                <p>
                  <span className="role-badge">{viewAccount.role}</span>
                </p>
              </div>

              <div className="detail-group">
                <label>Status</label>
                <p>
                  <span className={`status-badge-detail ${viewAccount.status}`}>
                    {viewAccount.status}
                  </span>
                </p>
              </div>

              <div className="detail-group">
                <label>Join Date</label>
                <p>{viewAccount.joinDate}</p>
              </div>

              <div className="detail-actions">
                <button className="btn-close" onClick={handleCloseView}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay" onClick={handleCloseAddForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Admin</h3>
              <button className="close-btn" onClick={handleCloseAddForm}>
                ✕
              </button>
            </div>

            <form className="add-admin-form" onSubmit={handleSubmitAddAdmin}>
              <div className="form-group">
                <label htmlFor="add-name">Full Name</label>
                <input
                  type="text"
                  id="add-name"
                  name="name"
                  value={newAdminForm.name}
                  onChange={handleAddFormChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-email">Email Address</label>
                <input
                  type="email"
                  id="add-email"
                  name="email"
                  value={newAdminForm.email}
                  onChange={handleAddFormChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-username">Username</label>
                <input
                  type="text"
                  id="add-username"
                  name="username"
                  value={newAdminForm.username}
                  onChange={handleAddFormChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-contact">Contact Number</label>
                <input
                  type="text"
                  id="add-contact"
                  name="contact"
                  value={newAdminForm.contact}
                  onChange={handleAddFormChange}
                  placeholder="e.g., +1-555-0100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-role">Role</label>
                <select
                  id="add-role"
                  name="role"
                  value={newAdminForm.role}
                  onChange={handleAddFormChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseAddForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Management;
