import { useState } from 'react';
import '../styles/Login.css';

function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your login logic here
    console.log('Login attempt:', { email, password, isAdmin });

    // Simulate login success - you would normally verify credentials
    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(isAdmin);
      }
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-icon">👕</div>
          <h1>WashTrack</h1>
          <p className="tagline">Smart Laundry Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
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
