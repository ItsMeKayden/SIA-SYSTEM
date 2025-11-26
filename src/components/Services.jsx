import { useState } from 'react';
import '../styles/Services.css';

function Services() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Wash & Fold',
      description: 'Standard washing and folding service',
      duration: '24 hours',
      price: '$15.00',
    },
    {
      id: 2,
      name: 'Dry Cleaning',
      description: 'Professional dry cleaning',
      duration: '48 hours',
      price: '$25.00',
    },
    {
      id: 3,
      name: 'Iron & Press',
      description: 'Ironing and pressing service',
      duration: '24 hours',
      price: '$10.00',
    },
    {
      id: 4,
      name: 'Express Service',
      description: 'Same day service',
      duration: '8 hours',
      price: '$35.00',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });

  const handleDeleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
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
      formData.duration &&
      formData.price
    ) {
      const newService = {
        id: services.length + 1,
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        price: formData.price,
      };
      setServices([...services, newService]);
      setFormData({ name: '', description: '', duration: '', price: '' });
      setShowForm(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', description: '', duration: '', price: '' });
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
              <th>Duration</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td className="service-name">{service.name}</td>
                <td>{service.description}</td>
                <td>{service.duration}</td>
                <td className="price-cell">{service.price}</td>
                <td className="actions-cell">
                  <button className="action-btn edit-btn" title="Edit">
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
                  <label htmlFor="duration">Duration</label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    placeholder="e.g., 24 hours"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
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
    </section>
  );
}

export default Services;
