import { useFetch } from '../../hooks/useFetch';
import Skeleton from '../ui/Skeleton';
import ErrorBanner from '../ui/ErrorBanner';
import Badge from '../ui/Badge';
import './UserProfile.css';

export default function UserProfile({ username }) {
  const { data, loading, error } = useFetch(
    username ? `https://api.github.com/users/${encodeURIComponent(username)}` : null
  );

  if (loading) return (
    <div className="user-profile">
      <Skeleton height="80px" width="80px" style={{ borderRadius: '50%' }} />
      <Skeleton height="1.5rem" width="60%" />
      <Skeleton height="1rem" width="80%" />
    </div>
  );

  if (error) return <ErrorBanner message="Failed to load user profile" />;
  if (!data) return null;

  return (
    <div className="user-profile">
      <img src={data.avatar_url} alt={data.login} className="user-avatar" />
      <div className="user-info">
        <h2 className="user-name">{data.name || data.login}</h2>
        <p className="user-login">@{data.login}</p>
        {data.bio && <p className="user-bio">{data.bio}</p>}
        <div className="user-stats">
          <Badge>{data.public_repos} repos</Badge>
          <Badge>{data.followers} followers</Badge>
          <Badge>{data.following} following</Badge>
        </div>
      </div>
    </div>
  );
}
