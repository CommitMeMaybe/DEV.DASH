import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart2, CloudRain, Terminal, CheckSquare, Code, X, LogOut } from 'lucide-react';
import './Sidebar.css';

// Persistent sidebar nav. Slides in as overlay on mobile (<768px).
// isOpen/onClose let the parent AppLayout control mobile toggle state.
export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  // Clears all stored user data and returns to the landing page.
  const handleLogout = () => {
    localStorage.removeItem('devdash_github_user');
    localStorage.removeItem('devdash_preferred_city');
    localStorage.removeItem('devdash_weather_city');
    onClose();
    navigate('/');
  };

  return (
    <>
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-header-row">
          <Link to="/" className="sidebar-header" onClick={onClose}>
            <Terminal className="logo-icon" size={28} />
            <span className="logo-text">SYS.DEV</span>
          </Link>
          <button className="sidebar-mobile-close" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <div className="divider"></div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <BarChart2 size={20} />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <CheckSquare size={20} />
            <span>Tasks</span>
          </NavLink>
          <NavLink to="/weather" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <CloudRain size={20} />
            <span>Weather</span>
          </NavLink>
          <NavLink to="/github" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Code size={20} />
            <span>Repos</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="status-text">ONLINE</span>
          </div>
        </div>
      </aside>
      {/* Tapping the backdrop on mobile closes the sidebar */}
      <div className={`sidebar-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />
    </>
  );
}
