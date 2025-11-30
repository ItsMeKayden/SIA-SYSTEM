import { useState, useEffect } from 'react';
import '../styles/Orders.css';

function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTerm, setFilteredTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    // Get userID from localStorage
    const storedUserID = localStorage.getItem('userID');
    console.log('Orders component mounted. Stored userID:', storedUserID);
    console.log('All localStorage items:', JSON.stringify(localStorage));

    if (storedUserID) {
      setUserID(storedUserID);
      fetchUserOrders(storedUserID);
    } else {
      setLoading(false);
      console.warn('No userID found in localStorage');
      alert('Please log in first');
    }
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/orders?userID=${userId}`
      );
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      } else {
        console.error('Failed to fetch orders:', result.error);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order.fld_orderID &&
        order.fld_orderID
          .toString()
          .toLowerCase()
          .includes(filteredTerm.toLowerCase())) ||
      (order.fld_items &&
        order.fld_items.toLowerCase().includes(filteredTerm.toLowerCase()))
  );

  const handleSearch = () => {
    setFilteredTerm(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return (
      <section className="orders-section">
        <p style={{ textAlign: 'center', padding: '20px' }}>
          Loading orders...
        </p>
      </section>
    );
  }

  return (
    <section className="orders-section">
      <div className="orders-header">
        <div className="header-content">
          <h3>My Orders</h3>
          <p className="orders-subtitle">View and track your orders</p>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search orders by ID or items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          🔍 Search
        </button>
      </div>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Service</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.fld_orderID}>
                  <td className="order-id">{order.fld_orderID}</td>
                  <td>{new Date(order.fld_orderDate).toLocaleDateString()}</td>
                  <td>{order.fld_serviceName || '-'}</td>
                  <td>{order.fld_items || '-'}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(order.fld_orderStatus),
                      }}
                    >
                      {order.fld_orderStatus}
                    </span>
                  </td>
                  <td className="total">
                    ${parseFloat(order.fld_amount).toFixed(2)}
                  </td>
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
    </section>
  );
}

export default Orders;
