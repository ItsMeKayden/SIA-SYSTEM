import { useState } from 'react';
import '../styles/Tracking.css';

function Tracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('ORD-001');

  const ordersData = [
    { id: 'ORD-001', date: '2025-11-09', status: 'processing' },
    { id: 'ORD-002', date: '2025-11-04', status: 'ready' },
    { id: 'ORD-003', date: '2025-11-03', status: 'completed' },
    { id: 'ORD-004', date: '2025-11-02', status: 'completed' },
    { id: 'ORD-005', date: '2025-11-01', status: 'pending' },
  ];

  const trackingData = {
    'ORD-001': {
      orderId: 'ORD-001',
      status: 'Processing',
      stages: [
        {
          name: 'Order Received',
          completed: true,
          date: '2025-11-05 • 09:00 AM',
        },
        { name: 'In Washing', completed: true, date: '2025-11-05 • 10:30 AM' },
        { name: 'Drying', completed: true, date: '2025-11-05 • 12:00 PM' },
        { name: 'Folding', completed: false, date: '2025-11-05 • 02:00 PM' },
        { name: 'Ready for Pickup', completed: false, date: 'Pending' },
      ],
    },
    'ORD-002': {
      orderId: 'ORD-002',
      status: 'Ready',
      stages: [
        {
          name: 'Order Received',
          completed: true,
          date: '2025-11-04 09:00 AM',
        },
        { name: 'Sorting', completed: true, date: '2025-11-04 10:15 AM' },
        { name: 'Washing', completed: true, date: '2025-11-04 02:00 PM' },
        { name: 'Drying', completed: true, date: '2025-11-04 06:30 PM' },
        { name: 'Ironing', completed: true, date: '2025-11-05 09:00 AM' },
        {
          name: 'Ready for Pickup',
          completed: true,
          date: '2025-11-05 03:00 PM',
        },
      ],
    },
    'ORD-003': {
      orderId: 'ORD-003',
      status: 'Completed',
      stages: [
        {
          name: 'Order Received',
          completed: true,
          date: '2025-11-03 08:00 AM',
        },
        { name: 'Sorting', completed: true, date: '2025-11-03 09:30 AM' },
        { name: 'Washing', completed: true, date: '2025-11-03 01:00 PM' },
        { name: 'Drying', completed: true, date: '2025-11-03 05:00 PM' },
        { name: 'Ironing', completed: true, date: '2025-11-04 08:00 AM' },
        {
          name: 'Ready for Pickup',
          completed: true,
          date: '2025-11-04 02:00 PM',
        },
      ],
    },
    'ORD-004': {
      orderId: 'ORD-004',
      status: 'Completed',
      stages: [
        {
          name: 'Order Received',
          completed: true,
          date: '2025-11-02 08:00 AM',
        },
        { name: 'Sorting', completed: true, date: '2025-11-02 09:30 AM' },
        { name: 'Washing', completed: true, date: '2025-11-02 01:00 PM' },
        { name: 'Drying', completed: true, date: '2025-11-02 05:00 PM' },
        { name: 'Ironing', completed: true, date: '2025-11-03 08:00 AM' },
        {
          name: 'Ready for Pickup',
          completed: true,
          date: '2025-11-03 02:00 PM',
        },
      ],
    },
    'ORD-005': {
      orderId: 'ORD-005',
      status: 'Pending',
      stages: [
        {
          name: 'Order Received',
          completed: true,
          date: '2025-11-01 08:00 AM',
        },
        { name: 'Sorting', completed: false, date: 'Pending' },
        { name: 'Washing', completed: false, date: 'Pending' },
        { name: 'Drying', completed: false, date: 'Pending' },
        { name: 'Ironing', completed: false, date: 'Pending' },
        { name: 'Ready for Pickup', completed: false, date: 'Pending' },
      ],
    },
  };

  const filteredOrders = ordersData.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentTracking =
    trackingData[selectedOrder] || trackingData['ORD-001'];

  return (
    <section className="tracking-section">
      <div className="tracking-header">
        <h3>Order Tracking</h3>
        <p className="tracking-subtitle">
          Track the status of your laundry orders
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tracking-search"
        />
        <button className="search-btn">🔍 Search</button>
      </div>

      <div className="tracking-main">
        <div className="orders-sidebar">
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`order-item ${
                  selectedOrder === order.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedOrder(order.id)}
              >
                <div className="order-info">
                  <p className="order-id">{order.id}</p>
                </div>
                <span className={`order-status ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="tracking-details">
          <div className="tracking-order-info">
            <div className="order-header">
              <div>
                <p className="order-label">Order ID</p>
                <p className="order-value">{currentTracking.orderId}</p>
              </div>
              <span className="order-status-badge">
                {currentTracking.status}
              </span>
            </div>
          </div>

          <div className="tracking-timeline">
            {currentTracking.stages.map((stage, index) => (
              <div
                key={index}
                className={`timeline-item ${
                  stage.completed ? 'completed' : ''
                }`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h5>{stage.name}</h5>
                  <p>{stage.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Tracking;
