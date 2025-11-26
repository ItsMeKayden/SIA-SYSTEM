import { useState } from 'react';
import '../styles/AdminOrders.css';

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      date: '2025-11-09',
      items: '5 shirts, 2 pants',
      status: 'processing',
      total: '$25.50',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      date: '2025-11-05',
      items: '3 dresses, 1 jacket',
      status: 'ready',
      total: '$45.00',
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      date: '2025-11-04',
      items: '10 shirts',
      status: 'pending',
      total: '$35.00',
    },
    {
      id: 'ORD-004',
      customer: 'Alice Brown',
      date: '2025-11-04',
      items: '2 blankets',
      status: 'completed',
      total: '$50.00',
    },
    {
      id: 'ORD-005',
      customer: 'Charlie Wilson',
      date: '2025-11-02',
      items: '4 pants, 6 shirts',
      status: 'pending',
      total: '$35.00',
    },
  ]);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer: '',
    date: '',
    items: '',
    total: '',
  });

  const ordersData = orders;

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleViewClick = (order) => {
    setViewOrder(order);
  };

  const handleCloseView = () => {
    setViewOrder(null);
  };

  const handleEditClick = (order) => {
    setEditOrder(order.id);
    setEditFormData({
      customer: order.customer,
      date: order.date,
      items: order.items,
      total: order.total,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = () => {
    setOrders(
      orders.map((order) =>
        order.id === editOrder ? { ...order, ...editFormData } : order
      )
    );
    setEditOrder(null);
  };

  const handleCancelEdit = () => {
    setEditOrder(null);
  };

  const handleDeleteClick = (orderId) => {
    setDeleteConfirm(orderId);
  };

  const confirmDelete = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const filteredOrders = ordersData.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return '#3498db';
      case 'ready':
        return '#27ae60';
      case 'completed':
        return '#2ecc71';
      case 'pending':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  return (
    <section className="admin-orders-section">
      <div className="section-header">
        <h3>Order Management</h3>
        <p>Manage and track all customer orders</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search orders by ID or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-id-cell">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="total-cell">{order.total}</td>
                <td className="actions-cell">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleViewClick(order)}
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditClick(order)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteClick(order.id)}
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
            <h3>Delete Order</h3>
            <p>
              Are you sure you want to delete this order? This action cannot be
              undone.
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

      {viewOrder && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details</h3>
              <button className="close-btn" onClick={handleCloseView}>
                ✕
              </button>
            </div>

            <div className="order-details">
              <div className="detail-group">
                <label>Order ID</label>
                <p>{viewOrder.id}</p>
              </div>

              <div className="detail-group">
                <label>Customer Name</label>
                <p>{viewOrder.customer}</p>
              </div>

              <div className="detail-group">
                <label>Order Date</label>
                <p>{viewOrder.date}</p>
              </div>

              <div className="detail-group">
                <label>Items</label>
                <p>{viewOrder.items}</p>
              </div>

              <div className="detail-group">
                <label>Status</label>
                <p>
                  <span
                    className="status-badge-detail"
                    style={{
                      backgroundColor: getStatusColor(viewOrder.status),
                    }}
                  >
                    {viewOrder.status}
                  </span>
                </p>
              </div>

              <div className="detail-group">
                <label>Total Amount</label>
                <p className="total-amount">{viewOrder.total}</p>
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

      {editOrder && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Order</h3>
              <button className="close-btn" onClick={handleCancelEdit}>
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
              className="edit-form"
            >
              <div className="form-group">
                <label htmlFor="edit-customer">Customer Name</label>
                <input
                  type="text"
                  id="edit-customer"
                  name="customer"
                  value={editFormData.customer}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-date">Order Date</label>
                <input
                  type="date"
                  id="edit-date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-items">Items</label>
                <textarea
                  id="edit-items"
                  name="items"
                  value={editFormData.items}
                  onChange={handleEditChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-total">Total Amount</label>
                <input
                  type="text"
                  id="edit-total"
                  name="total"
                  value={editFormData.total}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminOrders;
