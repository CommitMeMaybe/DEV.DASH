import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BarChart2, CloudRain, Terminal, CheckSquare, Code } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-header">
        <Terminal className="logo-icon" size={28} />
        <span className="logo-text">SYS.DEV</span>
      </Link>

      <div className="divider"></div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={20} />
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare size={20} />
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/weather" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CloudRain size={20} />
          <span>Weather</span>
        </NavLink>
        <NavLink to="/github" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
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
  );
}
