import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Star, GitFork, ExternalLink, Code, FileText } from 'lucide-react';
import useGitHub from '../hooks/useGitHub';
import './GitHub.css';

const GITHUB_USERNAME = localStorage.getItem('devdash_github_user') || '';

const readmeCache = new Map();

function RepoReadmePreview({ owner, repo }) {
  const [readme, setReadme] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key = `${owner}/${repo}`;
    if (readmeCache.has(key)) {
      setReadme(readmeCache.get(key));
      return;
    }
    setLoading(true);
    const headers = { 'Accept': 'application/vnd.github.v3.raw' };
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) headers['Authorization'] = `token ${token}`;
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers })
      .then(r => r.ok ? r.text() : null)
      .then(text => {
        if (!text) return;
        const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('```') && !l.startsWith('---'));
        const first = lines[0]?.replace(/[#*`_\[\]()>|~]/g, '').trim();
        if (first && first.length < 200) {
          readmeCache.set(key, first);
          setReadme(first);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [owner, repo]);

  if (loading) return <div className="readme-skeleton" />;
  if (!readme) return null;
  return (
    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', opacity: 0.8 }}>
      <FileText size={12} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
      {readme}
    </p>
  );
}

const GitHubSkeleton = () => (
  <div className="github-skeleton-container" style={{ opacity: 0.5, pointerEvents: 'none' }}>
    <div className="user-profile card skeleton-card" style={{marginBottom:'1.5rem'}}>
      <div style={{display:'flex',gap:'1.5rem',alignItems:'center'}}>
        <div className="skeleton-circle" style={{width:'80px',height:'80px'}}></div>
        <div style={{flex:1}}>
          <div className="skeleton-line" style={{width:'40%',height:'1.5rem',marginBottom:'0.5rem'}}></div>
          <div className="skeleton-line" style={{width:'20%',height:'1rem',marginBottom:'0.5rem'}}></div>
          <div className="skeleton-line" style={{width:'60%',height:'1rem'}}></div>
        </div>
      </div>
    </div>
    
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
      <div className="skeleton-line" style={{width:'20%',height:'1.5rem'}}></div>
      <div className="skeleton-line" style={{width:'15%',height:'2rem'}}></div>
    </div>
    
    <div className="repo-grid">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="card repo-card skeleton-card">
          <div className="skeleton-line" style={{width:'50%',height:'1.2rem',marginBottom:'1rem'}}></div>
          <div className="skeleton-line" style={{width:'80%',height:'1rem',marginBottom:'0.5rem'}}></div>
          <div className="skeleton-line" style={{width:'60%',height:'1rem',marginBottom:'1rem'}}></div>
          <div className="skeleton-line" style={{width:'100%',height:'0.8rem'}}></div>
        </div>
      ))}
    </div>
  </div>
);

export default function GitHubPage() {
  const [inputUser, setInputUser] = useState(GITHUB_USERNAME);
  const { user, repos, loading, error, reload } = useGitHub(GITHUB_USERNAME);
  const [search, setSearch] = useState('');

  const handleSetUser = (e) => {
    e.preventDefault();
    if (inputUser.trim()) {
      localStorage.setItem('devdash_github_user', inputUser.trim());
      window.location.reload();
    }
  };

  const filteredRepos = repos?.filter(r => r.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="github-page fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">REPO EXPLORER</h1>
          <p className="text-muted">{user ? `${user.public_repos} public repos • ${user.followers} followers` : 'GitHub repository browser'}</p>
        </div>
        <form onSubmit={handleSetUser} style={{display:'flex',gap:'0.5rem'}}>
          <input type="text" value={inputUser} onChange={e=>setInputUser(e.target.value)}
            placeholder="GitHub username" style={{padding:'0.5rem 1rem',background:'var(--bg-surface)',border:'1px solid var(--border-color)',borderRadius:'4px',color:'var(--text-primary)',fontFamily:'var(--font-mono)'}} />
          <button className="btn-retro" type="submit"><Search size={14}/> FETCH</button>
        </form>
      </header>

      {loading && !error && <GitHubSkeleton />}
      {error && (
        <div style={{ position: 'relative' }}>
          <GitHubSkeleton />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15, 17, 21, 0.8)', backdropFilter: 'blur(4px)', zIndex: 10, borderRadius: '8px', padding: '2rem'
          }}>
            <AlertTriangle color="var(--color-warning)" size={48} />
            <p className="text-muted" style={{marginTop:'1rem', fontSize: '1.2rem'}}>{error}</p>
            <p className="text-muted" style={{marginTop:'0.5rem', maxWidth: '400px', textAlign: 'center'}}>
              This usually happens when you hit GitHub's unauthenticated API rate limit (60 requests/hr). Please wait or add a Personal Access Token.
            </p>
            <button className="btn-retro" onClick={reload} style={{marginTop:'1.5rem'}}>RETRY</button>
          </div>
        </div>
      )}

      {user && !loading && (
        <div className="user-profile card" style={{marginBottom:'1.5rem'}}>
          <div style={{display:'flex',gap:'1.5rem',alignItems:'center'}}>
            <img src={user.avatar_url} alt={user.login} style={{width:'80px',height:'80px',borderRadius:'8px',border:'2px solid var(--border-color)'}} />
            <div style={{flex:1}}>
              <h2 className="retro-text" style={{fontSize:'1.5rem',marginBottom:'0.25rem'}}>{user.name || user.login}</h2>
              <p className="text-muted" style={{fontSize:'0.875rem',marginBottom:'0.5rem'}}>@{user.login}</p>
              {user.bio && <p style={{fontSize:'0.875rem',color:'var(--text-secondary)'}}>{user.bio}</p>}
              <div style={{display:'flex',gap:'1rem',marginTop:'0.75rem',fontSize:'0.875rem',color:'var(--text-secondary)'}}>
                <span>⭐ {user.public_repos} repos</span>
                <span>👥 {user.followers} followers</span>
                <span>🔗 <a href={user.html_url} target="_blank" rel="noreferrer" style={{color:'var(--text-accent)'}}>View on GitHub <ExternalLink size={12}/></a></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {repos && (
        <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <h3 className="retro-text" style={{fontSize:'1.2rem'}}>REPOSITORIES ({filteredRepos.length})</h3>
            <input type="text" placeholder="Filter repos..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{padding:'0.4rem 0.8rem',background:'var(--bg-surface)',border:'1px solid var(--border-color)',borderRadius:'4px',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:'0.875rem'}} />
          </div>
          <div className="repo-grid">
            {filteredRepos.map(repo => (
              <div key={repo.id} className="card repo-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.5rem'}}>
                  <a href={repo.html_url} target="_blank" rel="noreferrer" style={{color:'var(--text-accent)',fontWeight:'bold',fontSize:'1rem'}}>
                    {repo.name} <ExternalLink size={14} style={{marginLeft:'0.25rem'}}/>
                  </a>
                  {repo.private && <span style={{fontSize:'0.7rem',padding:'0.1rem 0.5rem',background:'var(--bg-surface)',borderRadius:'3px',color:'var(--text-secondary)'}}>PRIVATE</span>}
                </div>
                {repo.description
                  ? <p style={{fontSize:'0.875rem',color:'var(--text-secondary)',marginBottom:'0.75rem'}}>{repo.description}</p>
                  : <RepoReadmePreview owner={user.login} repo={repo.name} />}
                <div style={{display:'flex',gap:'1rem',fontSize:'0.8rem',color:'var(--text-secondary)'}}>
                  {repo.language && <span style={{display:'flex',alignItems:'center',gap:'0.25rem'}}><Code size={14}/> {repo.language}</span>}
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                  <span style={{marginLeft:'auto'}}>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {filteredRepos.length === 0 && <div className="text-muted" style={{textAlign:'center',padding:'2rem'}}>No repositories match your filter</div>}
          </div>
        </>
      )}
    </div>
  );
}
