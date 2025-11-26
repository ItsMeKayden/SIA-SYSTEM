import { useState } from 'react';
import '../styles/Orders.css';

function Orders() {
  const [searchTerm, setSearchTerm] = useState('');

  const ordersData = [
    {
      id: 'ORD-001',
      date: '2025-11-09',
      items: '5 shirts, 2 pants',
      status: 'processing',
      total: '$25.50',
    },
    {
      id: 'ORD-002',
      date: '2025-11-04',
      items: '3 dresses, 1 jacket',
      status: 'ready',
      total: '$45.00',
    },
    {
      id: 'ORD-003',
      date: '2025-11-03',
      items: '10 shirts',
      status: 'completed',
      total: '$35.00',
    },
    {
      id: 'ORD-004',
      date: '2025-11-02',
      items: '2 blankets',
      status: 'completed',
      total: '$50.00',
    },
    {
      id: 'ORD-005',
      date: '2025-11-01',
      items: '4 pants, 6 shirts',
      status: 'pending',
      total: '$35.00',
    },
  ];

  const filteredOrders = ordersData.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
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
    <section className="orders-section">
      <div className="orders-header">
        <h3>Order List</h3>
        <p className="orders-subtitle">View and search your laundry orders</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="total">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="no-results">
          <p>No orders found matching your search.</p>
        </div>
      )}
    </section>
  );
}

export default Orders;
