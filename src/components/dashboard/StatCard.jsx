import './StatCard.css';

export default function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-value">{value}</p>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );
}
