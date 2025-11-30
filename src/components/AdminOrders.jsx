import { useState, useEffect } from 'react';
import '../styles/AdminOrders.css';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminID, setAdminID] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    userID: '',
    userName: '',
    selectedServices: [],
    orderDate: '',
    status: 'Pending',
    amount: '',
    items: '',
  });
  const [newOrderForm, setNewOrderForm] = useState({
    userID: '',
    userName: '',
    orderDate: '',
    items: '',
    status: 'Pending',
    selectedServices: [],
    amount: '$0.00',
  });

  // Fetch orders and services on component mount
  useEffect(() => {
    // Get admin ID from localStorage
    const storedAdminID = localStorage.getItem('adminID');
    if (storedAdminID) {
      setAdminID(storedAdminID);
    }
    fetchOrders();
    fetchServices();

    // Set up auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8081/orders');
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const response = await fetch('http://localhost:8081/services');
      const result = await response.json();
      console.log('Services response:', result);
      if (result.success) {
        console.log('Services loaded:', result.data);
        setServices(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const ordersData = orders;

  const handleStatusChange = (orderId, newStatus) => {
    // Update locally
    setOrders(
      orders.map((order) =>
        order.fld_orderID === orderId
          ? { ...order, fld_orderStatus: newStatus }
          : order
      )
    );

    // Update in database
    fetch(`http://localhost:8081/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    }).catch((error) => console.error('Failed to update status:', error));
  };

  const handleViewClick = (order) => {
    setViewOrder(order);
  };

  const handleCloseView = () => {
    setViewOrder(null);
  };

  const handleEditClick = (order) => {
    setEditOrder(order.fld_orderID);
    // Convert ISO date to yyyy-MM-dd format for date input
    const dateObject = new Date(order.fld_orderDate);
    const formattedDate = dateObject.toISOString().split('T')[0];
    setEditFormData({
      userID: order.fld_userID,
      userName: order.fld_username || '-',
      selectedServices: [order.fld_serviceID],
      orderDate: formattedDate,
      status: order.fld_orderStatus,
      amount: order.fld_amount,
      items: order.fld_items || '',
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditServiceToggle = (serviceId) => {
    setEditFormData((prev) => {
      // For single selection - if already selected, deselect it; otherwise select it
      const updatedServices = prev.selectedServices.includes(serviceId)
        ? []
        : [serviceId];

      // Calculate total price from database services
      const totalPrice = updatedServices.reduce((sum, id) => {
        const service = services.find((s) => s.fld_serviceID === id);
        return sum + (service ? parseFloat(service.fld_servicePrice) : 0);
      }, 0);

      return {
        ...prev,
        selectedServices: updatedServices,
        amount: totalPrice.toFixed(2),
      };
    });
  };

  const handleSaveEdit = async () => {
    console.log('=== handleSaveEdit called ===');
    console.log('editFormData:', editFormData);
    console.log('editOrder:', editOrder);

    if (!editFormData.selectedServices.length) {
      showErrorToast('Please select at least one service');
      return;
    }

    try {
      const orderData = {
        serviceID: editFormData.selectedServices[0],
        orderDate: editFormData.orderDate,
        status: editFormData.status,
        amount: editFormData.amount,
        items: editFormData.items,
      };

      console.log(
        'Sending PUT request to:',
        `http://localhost:8081/orders/${editOrder}`
      );
      console.log('Order data:', orderData);

      const response = await fetch(
        `http://localhost:8081/orders/${editOrder}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();
      console.log('Response from server:', result);

      if (result.success) {
        // Refresh orders from backend to ensure latest data
        await fetchOrders();
        setEditOrder(null);
        showSuccessToast('Order updated successfully!');
      } else {
        showErrorToast('Failed to update order: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      showErrorToast('Failed to update order');
    }
  };

  const handleCancelEdit = () => {
    setEditOrder(null);
  };

  const handleDeleteClick = (orderId) => {
    setDeleteConfirm(orderId);
  };

  const confirmDelete = (orderId) => {
    if (!orderId) return;

    fetch(`http://localhost:8081/orders/${orderId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // Remove from local state
          setOrders(orders.filter((order) => order.fld_orderID !== orderId));
          console.log('Order deleted successfully');
          showSuccessToast('Order deleted successfully');
        }
      })
      .catch((error) => console.error('Failed to delete order:', error));

    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleAddOrderClick = () => {
    setShowAddForm(true);
  };

  const handleServiceToggle = (serviceId) => {
    setNewOrderForm((prev) => {
      const isSelected = prev.selectedServices.includes(serviceId);
      const updatedServices = isSelected
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId];

      // Calculate total price from database services
      const totalPrice = updatedServices.reduce((sum, id) => {
        const service = services.find((s) => s.fld_serviceID === id);
        return sum + (service ? parseFloat(service.fld_servicePrice) : 0);
      }, 0);

      return {
        ...prev,
        selectedServices: updatedServices,
        amount: `$${totalPrice.toFixed(2)}`,
      };
    });
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setNewOrderForm({
      userID: '',
      userName: '',
      orderDate: '',
      items: '',
      status: 'Pending',
      selectedServices: [],
      amount: '$0.00',
    });
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setNewOrderForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If userID field changed, fetch user data
    if (name === 'userID' && value) {
      fetchUserData(value);
    }
  };

  const fetchUserData = async (userID) => {
    try {
      console.log('Fetching user data for ID:', userID);
      const response = await fetch(
        `http://localhost:8081/getuser/id/${userID}`
      );
      const result = await response.json();
      console.log('User fetch result:', result);
      if (result.success && result.user) {
        setNewOrderForm((prev) => ({
          ...prev,
          userName: result.user.fld_username || 'User not found',
        }));
      } else {
        setNewOrderForm((prev) => ({
          ...prev,
          userName: 'User does not exist',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setNewOrderForm((prev) => ({
        ...prev,
        userName: 'User does not exist',
      }));
    }
  };

  const handleSubmitAddOrder = async (e) => {
    e.preventDefault();
    console.log('Current adminID:', adminID);
    if (
      newOrderForm.userID &&
      newOrderForm.orderDate &&
      newOrderForm.selectedServices.length > 0 &&
      newOrderForm.items.trim() !== ''
    ) {
      try {
        const orderData = {
          userID: parseInt(newOrderForm.userID),
          serviceID: newOrderForm.selectedServices[0],
          orderDate: newOrderForm.orderDate,
          status: newOrderForm.status,
          amount: newOrderForm.amount.replace('$', ''),
          adminID: adminID,
          items: newOrderForm.items,
        };
        console.log('Sending order data:', orderData);

        const response = await fetch('http://localhost:8081/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
        const result = await response.json();
        if (result.success) {
          fetchOrders();
          handleCloseAddForm();
        } else {
          showErrorToast('Failed to create order: ' + result.error);
        }
      } catch (error) {
        console.error('Failed to create order:', error);
        showErrorToast('Failed to create order');
      }
    } else {
      showErrorToast('Please fill in all required fields including Items');
    }
  };

  const filteredOrders = ordersData.filter(
    (order) =>
      (order.fld_orderID &&
        order.fld_orderID
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (order.fld_userID &&
        order.fld_userID
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
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
        <div className="header-content">
          <h3>Order Management</h3>
          <p>Manage and track all customer orders</p>
        </div>
        <button className="add-order-btn" onClick={handleAddOrderClick}>
          ➕ Add Order
        </button>
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
              <th>Service</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.fld_orderID}>
                  <td className="order-id-cell">{order.fld_orderID}</td>
                  <td>{order.fld_username || '-'}</td>
                  <td>{new Date(order.fld_orderDate).toLocaleDateString()}</td>
                  <td>{order.fld_serviceName || '-'}</td>
                  <td>{order.fld_items || '-'}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.fld_orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.fld_orderID, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="total-cell">
                    ${parseFloat(order.fld_amount).toFixed(2)}
                  </td>
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
                      onClick={() => handleDeleteClick(order.fld_orderID)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  No orders available
                </td>
              </tr>
            )}
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
                <p>{viewOrder.fld_orderID}</p>
              </div>

              <div className="detail-group">
                <label>Customer Name</label>
                <p>{viewOrder.fld_username || '-'}</p>
              </div>

              <div className="detail-group">
                <label>Order Date</label>
                <p>{new Date(viewOrder.fld_orderDate).toLocaleDateString()}</p>
              </div>

              <div className="detail-group">
                <label>Service</label>
                <p>{viewOrder.fld_serviceName || '-'}</p>
              </div>

              <div className="detail-group">
                <label>Items</label>
                <p>{viewOrder.fld_items || '-'}</p>
              </div>

              <div className="detail-group">
                <label>Status</label>
                <p>
                  <span
                    className="status-badge-detail"
                    style={{
                      backgroundColor: getStatusColor(
                        viewOrder.fld_orderStatus
                      ),
                    }}
                  >
                    {viewOrder.fld_orderStatus}
                  </span>
                </p>
              </div>

              <div className="detail-group">
                <label>Total Amount</label>
                <p className="total-amount">
                  ${parseFloat(viewOrder.fld_amount).toFixed(2)}
                </p>
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
                <label htmlFor="edit-orderID">Order ID</label>
                <input
                  type="text"
                  id="edit-orderID"
                  name="orderID"
                  value={editOrder}
                  disabled
                  readOnly
                  className="read-only-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-userID">User ID</label>
                <input
                  type="text"
                  id="edit-userID"
                  name="userID"
                  value={editFormData.userID}
                  disabled
                  readOnly
                  className="read-only-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-userName">Customer Name</label>
                <input
                  type="text"
                  id="edit-userName"
                  name="userName"
                  value={editFormData.userName}
                  disabled
                  readOnly
                  className="read-only-field"
                />
              </div>

              <div className="form-group">
                <label>Select Service</label>
                <div className="services-checkboxes">
                  {services && services.length > 0 ? (
                    services.map((service) => (
                      <label
                        key={service.fld_serviceID}
                        className="service-checkbox"
                      >
                        <input
                          type="radio"
                          name="editService"
                          checked={editFormData.selectedServices.includes(
                            service.fld_serviceID
                          )}
                          onChange={() =>
                            handleEditServiceToggle(service.fld_serviceID)
                          }
                          disabled={service.fld_serviceStatus !== 'Available'}
                        />
                        <span className="checkbox-label">
                          {service.fld_serviceName} - $
                          {parseFloat(service.fld_servicePrice).toFixed(2)}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p>No services available</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-date">Order Date</label>
                <input
                  type="date"
                  id="edit-date"
                  name="orderDate"
                  value={editFormData.orderDate}
                  onChange={handleEditFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-items">Items</label>
                <textarea
                  id="edit-items"
                  name="items"
                  value={editFormData.items}
                  onChange={handleEditFormChange}
                  placeholder="Enter the items ordered"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="edit-amount">
                  Total Amount (Auto-calculated)
                </label>
                <input
                  type="text"
                  id="edit-amount"
                  name="amount"
                  value={`$${parseFloat(editFormData.amount || 0).toFixed(2)}`}
                  placeholder="$0.00"
                  readOnly
                  disabled
                  className="read-only-field"
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

      {showAddForm && (
        <div className="modal-overlay" onClick={handleCloseAddForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Order</h3>
              <button className="close-btn" onClick={handleCloseAddForm}>
                ✕
              </button>
            </div>

            <form className="add-order-form" onSubmit={handleSubmitAddOrder}>
              <div className="form-group">
                <label htmlFor="add-userID">User ID</label>
                <input
                  type="number"
                  id="add-userID"
                  name="userID"
                  value={newOrderForm.userID}
                  onChange={handleAddFormChange}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-userName">Customer Name</label>
                <input
                  type="text"
                  id="add-userName"
                  name="userName"
                  value={newOrderForm.userName}
                  readOnly
                  className="read-only-field"
                  placeholder="Enter user ID above"
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-date">Order Date</label>
                <input
                  type="date"
                  id="add-date"
                  name="orderDate"
                  value={newOrderForm.orderDate}
                  onChange={handleAddFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Services</label>
                <div className="services-checkboxes">
                  {services && services.length > 0 ? (
                    services.map((service) => (
                      <label
                        key={service.fld_serviceID}
                        className="service-checkbox"
                      >
                        <input
                          type="checkbox"
                          checked={newOrderForm.selectedServices.includes(
                            service.fld_serviceID
                          )}
                          onChange={() =>
                            handleServiceToggle(service.fld_serviceID)
                          }
                          disabled={service.fld_serviceStatus !== 'Available'}
                        />
                        <span className="checkbox-label">
                          {service.fld_serviceName} - $
                          {parseFloat(service.fld_servicePrice).toFixed(2)}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p>No services available</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="add-items">Items</label>
                <textarea
                  id="add-items"
                  name="items"
                  value={newOrderForm.items}
                  onChange={handleAddFormChange}
                  placeholder="Enter the items ordered"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="add-status">Status</label>
                <select
                  id="add-status"
                  name="status"
                  value={newOrderForm.status}
                  onChange={handleAddFormChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="add-total">
                  Total Amount (Auto-calculated)
                </label>
                <input
                  type="text"
                  id="add-total"
                  name="amount"
                  value={newOrderForm.amount}
                  placeholder="$0.00"
                  readOnly
                  className="read-only-field"
                />
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
                  Add Order
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
