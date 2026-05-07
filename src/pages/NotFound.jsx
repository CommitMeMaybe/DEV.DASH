import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found-code">404</h1>
      <p className="not-found-text">We couldn't find that page</p>
      <Link to="/" className="not-found-link">Back to Home</Link>
    </div>
  );
}
