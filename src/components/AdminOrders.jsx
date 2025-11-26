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

  const ordersData = orders;

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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
                  <button className="action-btn view-btn">👁️</button>
                  <button className="action-btn edit-btn">✏️</button>
                  <button className="action-btn delete-btn">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminOrders;
