import { useState, useEffect } from 'react';
import '../styles/Profile.css';

function Profile() {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's email from localStorage
  const getLoggedInUserEmail = () => {
    return localStorage.getItem('userEmail') || '';
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userEmail = getLoggedInUserEmail();
      if (!userEmail) {
        console.error('No user email found');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8081/getuser/${userEmail}`);
      const data = await response.json();
      
      if (data.success) {
        setProfileData({
          fullName: data.user.fld_username || '',
          email: data.user.fld_email || '',
          phone: data.user.fld_contact || '',
          address: '', // You'll need to fetch this from tbl_address separately
        });
      } else {
        console.error('Failed to fetch user data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const userEmail = getLoggedInUserEmail();
      const response = await fetch('http://localhost:8081/updateuser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          updates: profileData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Profile changes saved successfully!');
        // Refresh data to show updated information
        fetchUserData();
      } else {
        alert('Failed to save changes: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile changes');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <section className="profile-section">
      <div className="profile-header">
        <h3>Profile Settings</h3>
        <p className="profile-subtitle">Manage your account information</p>
      </div>

      <div className="profile-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={profileData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />
        </div>

        <button className="btn btn-save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </section>
  );
}

export default Profile;