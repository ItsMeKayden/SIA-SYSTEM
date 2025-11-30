import { useState, useEffect } from 'react';
import '../styles/Profile.css';

function Profile({ onRefreshUserData }) {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [userId, setUserId] = useState(null);
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

      // GET DATA FROM tbl_user
      const userResponse = await fetch(`http://localhost:8081/getuser/${userEmail}`);
      const userData = await userResponse.json();
      
      if (userData.success) {
        // Store userId for later use
        setUserId(userData.user.fld_userID);
        
        // GET ADDRESS FROM tbl_profiles using the userId
        const profileResponse = await fetch(`http://localhost:8081/getprofile/${userData.user.fld_userID}`);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const userEmail = getLoggedInUserEmail();
      
      // Check if passwords match and are not empty
      if (passwordData.newPassword && passwordData.confirmPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        
        if (passwordData.newPassword.length < 6) {
          alert('Password must be at least 6 characters long!');
          return;
        }

        // Update password first
        const passwordResponse = await fetch('http://localhost:8081/updatepassword', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            newPassword: passwordData.newPassword
          })
        });
        
        const passwordResult = await passwordResponse.json();
        
        if (!passwordResult.success) {
          alert('Password update failed: ' + passwordResult.error);
          return;
        }
      }
      
      // FOR UPDATING tbl_user
      const userResponse = await fetch('http://localhost:8081/updateuser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          updates: profileData
        })
      });
      
      const userData = await userResponse.json();
      
      if (userData.success) {
        // FOR UPDATING tbl_profiles using userId
        const profileResponse = await fetch('http://localhost:8081/updateprofile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            address: profileData.address
          })
        });
        
        const profileDataResult = await profileResponse.json();
        
        if (profileDataResult.success) {
          // Clear password fields after successful save
          setPasswordData({
            newPassword: '',
            confirmPassword: ''
          });
          
          alert('Profile changes saved successfully!');

          if (onRefreshUserData) {
            // Fetch the updated user data
            const updatedResponse = await fetch(`http://localhost:8081/getuser/${userEmail}`);
            const updatedData = await updatedResponse.json();
          
            if (updatedData.success) {
              onRefreshUserData(updatedData.user); // Update parent state
            }
          }
          
          fetchUserData();
        } else {
          alert('User data saved but profile address update failed: ' + profileDataResult.error);
        }
      } else {
        alert('Failed to save changes: ' + userData.error);
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

      <div className="form-group">
        <p className="field-description">Your unique user identifier</p>
        <label htmlFor="userId">User ID: {userId || 'Loading...'}</label>
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

        {/* Change Password Section */}
        <div className="password-section">
          <h4>Change Password</h4>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
          </div>
          {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
            <p className="error-message">Passwords do not match!</p>
          )}
        </div>

        <button className="btn btn-save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </section>
  );
}

export default Profile;