import { useState, useEffect } from 'react';
import '../styles/Profile.css';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

function Profile() {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's email from localStorage
  const getLoggedInUserEmail = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('No user email found in localStorage');
    }
    return userEmail || '';
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      let userEmail = getLoggedInUserEmail();
      const userID = localStorage.getItem('userID');

      // If no email in localStorage, we can try using userID as fallback
      // But for now, just wait for a valid email
      if (!userEmail) {
        console.error('No user email found in localStorage');
        setLoading(false);
        return;
      }

      // GET DATA FROM tbl_user
      const userResponse = await fetch(
        `http://localhost:8081/getuser/${userEmail}`
      );
      const userData = await userResponse.json();

      if (userData.success) {
        // Store userId for later use
        setUserId(userData.user.fld_userID);

        // GET ADDRESS FROM tbl_profiles using the userId
        const profileResponse = await fetch(
          `http://localhost:8081/getprofile/${userData.user.fld_userID}`
        );
        const profileData = await profileResponse.json();

        setProfileData({
          fullName: userData.user.fld_username || '',
          email: userData.user.fld_email || '',
          phone: userData.user.fld_contact || '',
          address: profileData.success ? profileData.profile.fld_address : '',
        });
      } else {
        console.error('Failed to fetch user data:', userData.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    if (!phone.trim()) return true; // Optional field
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 11; // Exactly 11 digits
  };

  const validateFullName = (name) => {
    return name.trim().length >= 2;
  };

  const validateAddress = (address) => {
    if (!address.trim()) return true; // Optional
    return address.trim().length >= 5;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Full Name validation
    if (!profileData.fullName.trim()) {
      showErrorToast('Full name is required');
      return;
    }

    if (!validateFullName(profileData.fullName)) {
      showErrorToast('Full name must be at least 2 characters');
      return;
    }

    // Email validation
    if (!profileData.email.trim()) {
      showErrorToast('Email is required');
      return;
    }

    if (!validateEmail(profileData.email)) {
      showErrorToast('Please enter a valid email address');
      return;
    }

    // Phone number validation
    if (profileData.phone && !validatePhoneNumber(profileData.phone)) {
      showErrorToast('Phone number must be exactly 11 digits');
      return;
    }

    // Address validation
    if (!validateAddress(profileData.address)) {
      showErrorToast('Address must be at least 5 characters');
      return;
    }
    try {
      const userEmail = getLoggedInUserEmail();

      // FOR UPDATING tbl_user
      const userResponse = await fetch('http://localhost:8081/updateuser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          updates: profileData,
        }),
      });

      const userData = await userResponse.json();

      if (userData.success) {
        // FOR UPDATING tbl_profiles using userId
        const profileResponse = await fetch(
          'http://localhost:8081/updateprofile',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              address: profileData.address,
            }),
          }
        );

        const profileDataResult = await profileResponse.json();

        if (profileDataResult.success) {
          showSuccessToast('Profile changes saved successfully!');
          fetchUserData();
        } else {
          showErrorToast(
            'User data saved but profile address update failed: ' +
              profileDataResult.error
          );
        }
      } else {
        showErrorToast('Failed to save changes: ' + userData.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showErrorToast('Error saving profile changes');
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
