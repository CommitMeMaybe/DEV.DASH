import './EmptyState.css';

export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📭</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
    </div>
  );
}
