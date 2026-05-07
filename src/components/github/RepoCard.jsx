import { useMemo } from 'react';
import Badge from '../ui/Badge';
import './RepoCard.css';

export default function RepoCard({ repo }) {
  return (
    <div className="repo-card">
      <div className="repo-header">
        <h3 className="repo-name">{repo.name}</h3>
        {repo.fork && <Badge variant="default">Fork</Badge>}
      </div>
      {repo.description && (
        <p className="repo-desc">{repo.description}</p>
      )}
      <div className="repo-meta">
        {repo.language && (
          <span className="repo-language">
            <span className="lang-dot" style={{ background: getLanguageColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span className="repo-stars">⭐ {repo.stargazers_count}</span>
        <span className="repo-forks">🔀 {repo.forks_count}</span>
        <span className="repo-updated">
          Updated {new Date(repo.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function getLanguageColor(lang) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    Ruby: '#701516',
    Go: '#00ADD8',
  };
  return colors[lang] || '#8E8E93';
}
