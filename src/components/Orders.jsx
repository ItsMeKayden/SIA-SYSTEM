import { useState } from 'react';
import '../styles/Orders.css';

function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: 'John Doe',
      date: '2024-01-15',
      items: 'Laundry Service, Ironing',
      status: 'completed',
      total: '$45.00',
    },
    {
      id: 2,
      customer: 'Jane Smith',
      date: '2024-01-16',
      items: 'Dry Cleaning',
      status: 'processing',
      total: '$30.00',
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      date: '2024-01-17',
      items: 'Laundry Service',
      status: 'pending',
      total: '$25.00',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    date: '',
    items: '',
    status: 'pending',
    total: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.customer &&
      formData.date &&
      formData.items &&
      formData.total
    ) {
      const newOrder = {
        id: Math.max(...orders.map((o) => o.id), 0) + 1,
        customer: formData.customer,
        date: formData.date,
        items: formData.items,
        status: formData.status,
        total: `$${parseFloat(formData.total).toFixed(2)}`,
      };
      setOrders([...orders, newOrder]);
      setFormData({
        customer: '',
        date: '',
        items: '',
        status: 'pending',
        total: '',
      });
      setShowForm(false);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      customer: '',
      date: '',
      items: '',
      status: 'pending',
      total: '',
    });
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="header-content">
          <h3>Order Management</h3>
          <p className="orders-subtitle">View and manage your orders</p>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search orders by ID..."
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
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Order</h3>
              <button className="close-btn" onClick={handleCloseForm}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="customer">Customer Name</label>
                <input
                  type="text"
                  id="customer"
                  name="customer"
                  placeholder="Enter customer name"
                  value={formData.customer}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Order Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="items">Items/Services</label>
                <input
                  type="text"
                  id="items"
                  name="items"
                  placeholder="Enter items or services"
                  value={formData.items}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="total">Total Amount</label>
                <input
                  type="number"
                  id="total"
                  name="total"
                  placeholder="Enter total amount"
                  value={formData.total}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Orders;
