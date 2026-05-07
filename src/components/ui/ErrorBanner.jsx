import './ErrorBanner.css';

export default function ErrorBanner({ message }) {
  return (
    <div className="error-banner">
      <span className="error-icon">⚠️</span>
      <p className="error-text">{message}</p>
    </div>
  );
}
