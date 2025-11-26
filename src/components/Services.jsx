import { useState } from 'react';
import '../styles/Services.css';

function Services() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Wash & Fold',
      description: 'Standard washing and folding service',
      status: 'Available',
      price: '$15.00',
    },
    {
      id: 2,
      name: 'Dry Cleaning',
      description: 'Professional dry cleaning',
      status: 'Available',
      price: '$25.00',
    },
    {
      id: 3,
      name: 'Iron & Press',
      description: 'Ironing and pressing service',
      status: 'Available',
      price: '$10.00',
    },
    {
      id: 4,
      name: 'Express Service',
      description: 'Same day service',
      status: 'Not Available',
      price: '$35.00',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editService, setEditService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Available',
    price: '',
  });

  const handleDeleteService = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id) => {
    setServices(services.filter((service) => service.id !== id));
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleEditClick = (service) => {
    setEditService(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      status: service.status,
      price: service.price,
    });
  };

  const handleSaveEdit = () => {
    if (
      formData.name &&
      formData.description &&
      formData.status &&
      formData.price
    ) {
      setServices(
        services.map((service) =>
          service.id === editService ? { ...service, ...formData } : service
        )
      );
      setEditService(null);
      setFormData({
        name: '',
        description: '',
        status: 'Available',
        price: '',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditService(null);
    setFormData({ name: '', description: '', status: 'Available', price: '' });
  };

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
      formData.name &&
      formData.description &&
      formData.status &&
      formData.price
    ) {
      const newService = {
        id: services.length + 1,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        price: formData.price,
      };
      setServices([...services, newService]);
      setFormData({
        name: '',
        description: '',
        status: 'Available',
        price: '',
      });
      setShowForm(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', description: '', status: 'Available', price: '' });
  };

  return (
    <section className="services-section">
      <div className="section-header">
        <div className="header-content">
          <h3>Service Management</h3>
          <p>Manage your laundry services and pricing</p>
        </div>
        <button
          className="create-service-btn"
          onClick={() => setShowForm(true)}
        >
          + Create Service
        </button>
      </div>

      <div className="table-wrapper">
        <table className="services-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td className="service-name">{service.name}</td>
                <td>{service.description}</td>
                <td>
                  <span
                    className={`status-badge ${service.status
                      .toLowerCase()
                      .replace(' ', '-')}`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="price-cell">{service.price}</td>
                <td className="actions-cell">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditClick(service)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    title="Delete"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Service</h3>
              <button className="close-btn" onClick={handleCloseForm}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group">
                <label htmlFor="name">Service Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g., Premium Wash"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the service..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Service Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    placeholder="e.g., $15.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Delete Service</h3>
            <p>
              Are you sure you want to delete this service? This action cannot
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

      {editService !== null && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Service</h2>
              <button className="close-btn" onClick={handleCancelEdit}>
                ×
              </button>
            </div>
            <form
              className="edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div className="form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter service name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter service description"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Service Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="e.g., $15.00"
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

export default Services;
