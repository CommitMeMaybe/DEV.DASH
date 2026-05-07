import React, { useState, useMemo } from 'react';
import { Flame, GitCommit, GitMerge, Star, Activity, TerminalSquare, CheckCircle2, Cpu, RefreshCw, AlertTriangle, User } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import useGitHub from '../hooks/useGitHub';
import useTasks from '../hooks/useTasks';
import useWeather from '../hooks/useWeather';
import ContributionHeatmap from '../components/github/ContributionHeatmap';
import Skeleton from '../components/ui/Skeleton';
import './Dashboard.css';

const GITHUB_USERNAME = (localStorage.getItem('devdash_github_user') || '').replace(/\s+/g, '') || 'facebook';

function MetricCard({ icon, label, value, color }) {
  return (
    <div className="metric-card card">
      <div className="metric-header">
        <span className="text-muted">{label}</span>
        <span className="glow-icon">{icon}</span>
      </div>
      <div className="metric-value retro-text glow-text" style={{ color }}>{value}</div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-container fade-in">
      <header className="page-header">
        <div>
          <Skeleton height="2.5rem" width="300px" />
          <Skeleton height="1rem" width="250px" style={{marginTop:'0.5rem'}} />
        </div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          <Skeleton height="2.5rem" width="120px" />
          <Skeleton height="2.5rem" width="80px" />
        </div>
      </header>
      <div className="metrics-grid">
        {[1,2,3,4].map(i => (
          <div key={i} className="metric-card card" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <Skeleton height="1rem" width="80px" />
            <Skeleton height="3rem" width="60px" />
          </div>
        ))}
      </div>
      <div className="bento-layout">
        <div className="bento-main">
          <div className="card span-full relative overflow-hidden">
            <div className="card-header">
              <Skeleton height="1rem" width="180px" />
            </div>
            <div className="chart-container">
              <Skeleton height="160px" />
            </div>
          </div>
          <div className="card" style={{gridColumn:'1 / 2'}}>
            <div className="card-header"><Skeleton height="1rem" width="140px" /></div>
            <Skeleton height="3rem" width="200px" />
            <Skeleton height="1rem" width="150px" style={{marginTop:'0.5rem'}} />
          </div>
          <div className="card insight-card">
            <div className="card-header"><Skeleton height="1rem" width="120px" /></div>
            <Skeleton height="4rem" />
          </div>
          <div className="card" style={{gridColumn:'1 / -1'}}>
            <div className="card-header"><Skeleton height="1rem" width="200px" /></div>
            <Skeleton height="120px" />
          </div>
        </div>
        <div className="bento-side">
          <div className="card todo-card">
            <div className="card-header"><Skeleton height="1rem" width="130px" /></div>
            {[1,2,3].map(i => <Skeleton key={i} height="2rem" style={{marginBottom:'0.5rem'}} />)}
          </div>
          <div className="card weather-mini-card">
            <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem'}}>
              <Skeleton height="3rem" width="80px" />
              <Skeleton height="1rem" width="60px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return <div className="dashboard-container fade-in" style={{textAlign:'center',padding:'4rem'}}>
    <AlertTriangle size={48} color="var(--color-warning)" style={{marginBottom:'1rem'}} />
    <p className="text-muted" style={{marginBottom:'1rem'}}>{message}</p>
    <button className="btn-retro" onClick={onRetry}>RETRY</button>
  </div>;
}

function EmptyState({ message }) {
  return <div style={{textAlign:'center',padding:'1rem',color:'var(--text-secondary)',fontSize:'0.875rem'}}>{message}</div>;
}

export default function Dashboard() {
  const { user, repos, metrics, loading, error, lastSync, reload } = useGitHub(GITHUB_USERNAME);
  const { tasks, toggleTask, removeTask } = useTasks();
  const { weather, loading: weatherLoading, city } = useWeather();
  const [githubUser, setGithubUser] = useState(GITHUB_USERNAME);

  const handleSetUsername = () => {
    const input = prompt('Enter GitHub username:', githubUser);
    if (input?.trim()) {
      const username = input.trim().replace(/\s+/g, '');
      localStorage.setItem('devdash_github_user', username);
      setGithubUser(username);
      window.location.reload();
    }
  };

  const activeTasks = tasks.filter(t => !t.done).slice(0, 4);
  const chartData = useMemo(() => {
    if (!metrics?.activityByDate) return [];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const counts = {};
    Object.entries(metrics.activityByDate).forEach(([date, count]) => {
      const day = days[new Date(date).getDay()];
      counts[day] = (counts[day] || 0) + count;
    });
    return days.map(day => ({ day, commits: counts[day] || 0 }));
  }, [metrics]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="dashboard-container fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">COMMAND CENTER</h1>
          <p className="text-muted">
            {user ? `Tracking: ${user.login} • ${repos?.length || 0} repos` : 'System nominal.'}
            {lastSync && ` • Last sync: ${Math.floor((Date.now() - lastSync) / 60000)}m ago`}
          </p>
        </div>
        <div className="header-actions">
          <button className="card btn-retro" onClick={handleSetUsername} title="Change GitHub user">
            <User size={14} /> {githubUser}
          </button>
          <button className="card btn-retro" onClick={reload}>
            <RefreshCw size={14} /> SYNC
          </button>
        </div>
      </header>

      <div className="metrics-grid">
        <MetricCard icon={<Flame size={18} color="var(--color-warning)" />} label="STREAK" value={`${metrics?.streak || 0} DAYS`} color="var(--color-warning)" />
        <MetricCard icon={<GitCommit size={18} color="var(--text-accent)" />} label="COMMITS (7D)" value={metrics?.commitsThisWeek || 0} color="var(--text-accent)" />
        <MetricCard icon={<GitMerge size={18} color="var(--color-success)" />} label="PR MERGE RATE" value={`${metrics?.mergeRate || 0}%`} color="var(--color-success)" />
        <MetricCard icon={<Star size={18} color="var(--color-warning)" />} label="STARS (30D)" value={`+${metrics?.starsGained || 0}`} color="var(--color-warning)" />
      </div>

      <div className="bento-layout">
        <div className="bento-main">
          <div className="card span-full relative overflow-hidden">
            <div className="card-header">
              <h3 className="card-title"><Activity size={18} /> ACTIVITY SNAPSHOT</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--text-accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--text-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '4px' }}
                    itemStyle={{ color: 'var(--text-accent)', fontFamily: 'var(--font-retro)', fontSize: '1.2rem' }} />
                  <Area type="monotone" dataKey="commits" stroke="var(--text-accent)" fillOpacity={1} fill="url(#colorCommits)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{gridColumn: '1 / 2'}}>
            <div className="card-header">
              <h3 className="card-title"><TerminalSquare size={18} /> TOP REPOSITORY</h3>
            </div>
            {metrics?.topRepo ? (
              <div className="repo-details">
                <div className="repo-name retro-text">{metrics.topRepo.full_name}</div>
                <div className="repo-stats" style={{display:'flex',gap:'1rem',fontSize:'0.875rem',color:'var(--text-secondary)',marginTop:'0.5rem'}}>
                  <span>⭐ {metrics.topRepo.stargazers_count}</span>
                  <span>🍴 {metrics.topRepo.forks_count}</span>
                  <span style={{color: metrics.topRepo.language ? 'var(--text-accent)' : 'var(--text-secondary)'}}>
                    {metrics.topRepo.language || 'N/A'}
                  </span>
                </div>
              </div>
            ) : <EmptyState message="No repos found" />}
          </div>

          <div className="card insight-card">
            <div className="card-header">
              <h3 className="card-title"><Cpu size={18} /> SYS.INSIGHT</h3>
            </div>
            <div className="insight-content">
              {metrics?.insights?.length ? metrics.insights.map((i, idx) => (
                <p key={idx} style={{color: i.type === 'warning' ? 'var(--color-warning)' : i.type === 'success' ? 'var(--color-success)' : 'var(--text-accent)'}}>
                  &gt; {i.text}
                </p>
              )) : <p className="text-muted">&gt; No activity data yet.</p>}
            </div>
          </div>

          <div className="card" style={{gridColumn: '1 / -1'}}>
            <div className="card-header">
              <h3 className="card-title"><Activity size={18} /> CONTRIBUTION HEATMAP</h3>
            </div>
            {metrics?.activityByDate ? <ContributionHeatmap data={metrics.activityByDate} /> : <EmptyState message="No activity data" />}
          </div>
        </div>

        <div className="bento-side">
          <div className="card todo-card">
            <div className="card-header">
              <h3 className="card-title"><CheckCircle2 size={18} /> ACTIVE TASKS</h3>
            </div>
            {activeTasks.length > 0 ? (
              <ul className="todo-list">
                {activeTasks.map(task => (
                  <li key={task.id} className={`todo-item ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}>
                    <div className="checkbox">{task.done ? '✓' : ''}</div>
                    <span>{task.title}</span>
                    <button className="icon-btn" onClick={(e) => { e.stopPropagation(); removeTask(task.id); }} style={{marginLeft:'auto',fontSize:'1rem'}}>×</button>
                  </li>
                ))}
              </ul>
            ) : <EmptyState message="No active tasks" />}
          </div>

          <div className="card weather-mini-card">
            {weatherLoading ? <Skeleton /> : weather ? (
              <div className="weather-mini-content">
                <span className="weather-temp retro-text glow-text">{Math.round(weather.main.temp)}°C</span>
                <span className="weather-desc text-muted">{weather.weather[0].main.toUpperCase()}</span>
                <span className="text-muted" style={{fontSize:'0.75rem'}}>{city}</span>
              </div>
            ) : <EmptyState message="Weather unavailable" />}
          </div>
        </div>
      </div>
    </div>
  );
}
