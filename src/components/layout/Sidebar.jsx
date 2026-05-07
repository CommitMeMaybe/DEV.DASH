import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

export default function Sidebar() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">DevDash</div>
      <ul className="sidebar-nav">
        <li><NavLink to="/dashboard" end className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink></li>
        <li><NavLink to="/github" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>GitHub</NavLink></li>
        <li><NavLink to="/tasks" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Tasks</NavLink></li>
      </ul>
      <div className="sidebar-auth">
        {isAuthenticated ? (
          <button onClick={logout} className="auth-btn">Log Out</button>
        ) : (
          <button onClick={() => login(false)} className="auth-btn">Start Session</button>
        )}
      </div>
    </nav>
  );
}
