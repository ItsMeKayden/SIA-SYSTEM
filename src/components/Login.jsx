import { useState } from 'react';
import '../styles/Login.css';

function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const endpoint = isAdmin
      ? 'http://localhost:8081/loginadmin'
      : 'http://localhost:8081/loginuser';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setLoading(false);
      
      // Store user email in localStorage
      localStorage.setItem('userEmail', email);
      
      // Store user data from the response
      if (result.user) {
        localStorage.setItem('userData', JSON.stringify(result.user));
      }
      
      // Store user type (admin or regular user)
      localStorage.setItem('userType', isAdmin ? 'admin' : 'user');
      
      if (onLoginSuccess) {
        onLoginSuccess(isAdmin, result.user); // ✅ Pass user data here
      }
    } else {
      setLoading(false);
      alert('Invalid email or password');
    }
  } catch (error) {
    setLoading(false);
    alert('Cannot connect to server. Make sure backend is running.');
  }
};

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-icon">👕</div>
          <h1>WashTrack</h1>
          <p className="tagline">Smart Laundry Management System</p>
        </div>

        {message && (
          <div className={`message ${message.includes('Invalid') || message.includes('Cannot connect') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              {isAdmin ? 'Admin Email' : 'Email'}
            </label>
            <input
              type="email"
              id="email"
              placeholder={isAdmin ? "Enter admin email" : "Enter your email"}
              value={email}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="admin">Login as Admin</label>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="register-section">
          <p>
            Don't have an account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister();
              }}
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;