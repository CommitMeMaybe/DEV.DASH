import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(stayLoggedIn);
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to DevDash</h1>
        <p className="login-subtitle">Start a local session to access your dashboard</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="checkbox-label">
            <input type="checkbox" checked={stayLoggedIn} onChange={(e) => setStayLoggedIn(e.target.checked)} className="checkbox-input" />
            <span className="checkbox-text">Keep session active</span>
          </label>
          <button type="submit" className="login-btn">Start Session</button>
        </form>
      </div>
    </div>
  );
}
