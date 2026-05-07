import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BarChart2, CloudRain, Terminal, CheckSquare, Code, X } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
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
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="retro-text glow-success" style={{ color: 'var(--color-success)', fontSize: '1rem' }}>SYSTEM ONLINE</span>
          </div>
        </div>
      </aside>
      <div className={`sidebar-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />
    </>
  );
}
