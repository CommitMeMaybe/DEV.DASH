import { useMemo } from 'react';
import RepoCard from './RepoCard';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import './RepoList.css';

export default function RepoList({ repos, searchQuery }) {
  const filteredRepos = useMemo(() => {
    return repos
      .filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  }, [repos, searchQuery]);

  if (!repos) return null;

  return (
    <div className="repo-list">
      {filteredRepos.length === 0 ? (
        <EmptyState title="No repositories found" description="Try adjusting your search query" />
      ) : (
        filteredRepos.map(repo => (
          <RepoCard key={repo.id} repo={repo} />
        ))
      )}
    </div>
  );
}
