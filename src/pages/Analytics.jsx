import React, { useState, useMemo } from 'react';
import { BarChart2, Filter, GitPullRequest, GitCommit, GitMerge, Settings, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import useGitHub from '../hooks/useGitHub';
import Skeleton from '../components/ui/Skeleton';
import './Analytics.css';

const GITHUB_USERNAME = (localStorage.getItem('devdash_github_user') || '').replace(/\s+/g, '');
const DAYS_MAP = { '7d': 7, '30d': 30, '90d': 90 };

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const { user, repos, metrics, loading, error, commits, pulls } = useGitHub(GITHUB_USERNAME);
  const days = DAYS_MAP[timeRange];
  const since = new Date(Date.now() - days * 86400000);

  const commitChartData = useMemo(() => {
    if (!commits) return [];
    const filtered = commits.filter(c => new Date(c.commit.author.date) >= since);
    const byDate = {};
    filtered.forEach(c => {
      const key = timeRange === '7d' ? new Date(c.commit.author.date).toLocaleDateString('en-US', {weekday:'short'}) :
        new Date(c.commit.author.date).toISOString().split('T')[0];
      byDate[key] = (byDate[key] || 0) + 1;
    });
    return Object.entries(byDate).map(([date, count]) => ({ date, commits: count })).sort((a,b) => new Date(a.date) - new Date(b.date));
  }, [commits, since, timeRange]);

  const prChartData = useMemo(() => {
    if (!pulls) return [];
    const filtered = pulls.filter(p => new Date(p.created_at) >= since);
    const byWeek = {};
    filtered.forEach(p => {
      const d = new Date(p.created_at);
      const week = `W${Math.ceil((d - since) / 604800000)}`;
      if (!byWeek[week]) byWeek[week] = { merged: 0, open: 0 };
      p.merged_at ? byWeek[week].merged++ : byWeek[week].open++;
    });
    return Object.entries(byWeek).map(([week, data]) => ({ week, ...data }));
  }, [pulls, since]);

  const activityTrend = useMemo(() => {
    if (!metrics?.activityByDate) return [];
    return Object.entries(metrics.activityByDate)
      .filter(([date]) => new Date(date) >= since)
      .map(([date, count]) => ({ date, count }))
      .sort((a,b) => new Date(a.date) - new Date(b.date));
  }, [metrics, since]);

  if (loading) return <AnalyticsSkeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="dashboard-container fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">ANALYTICS ENGINE</h1>
          <p className="text-muted">Deep dive into repository performance and metrics. {user?.public_repos || 0} public repos.</p>
        </div>
        <div className="header-actions">
          <div className="btn-retro" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Filter size={14} /> TIME RANGE:
            {Object.keys(DAYS_MAP).map(range => (
              <span key={range} className={`filter-item ${timeRange === range ? 'active' : ''}`} onClick={() => setTimeRange(range)}>{range}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="analytics-grid">
        <div className="card span-full">
          <div className="card-header flex-between">
            <h3 className="card-title"><BarChart2 size={18} /> COMMITS OVER TIME ({timeRange})</h3>
            <span className="text-muted" style={{fontSize:'0.75rem'}}>{commitChartData.reduce((s,d) => s + d.commits, 0)} total</span>
          </div>
          <div className="chart-container" style={{ height: '300px' }}>
            {commitChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commitChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 11}} />
                  <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 11}} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }} itemStyle={{ color: 'var(--text-accent)' }} />
                  <Bar dataKey="commits" fill="var(--text-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState message="No commit data for this period" />}
          </div>
        </div>

        <div className="card span-half">
          <div className="card-header">
            <h3 className="card-title"><GitPullRequest size={18} /> PR PERFORMANCE</h3>
          </div>
          <div className="chart-container" style={{ height: '200px' }}>
            {prChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                  <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }} />
                  <Line type="monotone" dataKey="merged" stroke="var(--color-success)" strokeWidth={2} dot={{ r: 4, fill: 'var(--bg-surface)' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="open" stroke="var(--color-warning)" strokeWidth={2} dot={{ r: 4, fill: 'var(--bg-surface)' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyState message="No PR data for this period" />}
          </div>
        </div>

        <div className="card span-half">
          <div className="card-header">
            <h3 className="card-title"><TrendingUp size={18} /> ACTIVITY TRENDS</h3>
          </div>
          <div className="chart-container" style={{ height: '200px' }}>
            {activityTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 10}} />
                  <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }} />
                  <Area type="monotone" dataKey="count" stroke="var(--color-success)" fill="url(#activityGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <EmptyState message="No activity data" />}
          </div>
        </div>

        <div className="card span-full impact-metrics">
          <div className="card-header">
            <h3 className="card-title"><Settings size={18} /> IMPACT ANALYSIS</h3>
          </div>
          <div className="impact-grid">
            <ImpactItem label="COMMITS" value={metrics?.commitsThisWeek || 0} sub="this week" color="var(--text-accent)" />
            <ImpactItem label="MERGE RATE" value={`${metrics?.mergeRate || 0}%`} sub="PR success" color="var(--color-success)" />
            <ImpactItem label="STREAK" value={`${metrics?.streak || 0} DAYS`} sub="current" color="var(--color-warning)" />
            <ImpactItem label="REPOS" value={repos?.length || 0} sub="tracked" color="var(--text-accent)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpactItem({ label, value, sub, color }) {
  return (
    <div className="impact-item">
      <span className="impact-label text-muted">{label}</span>
      <span className="impact-value retro-text glow-text" style={{color}}>{value}</span>
      <span className="text-muted" style={{fontSize:'0.7rem'}}>{sub}</span>
    </div>
  );
}
function AnalyticsSkeleton() {
  return (
    <div className="dashboard-container fade-in">
      <header className="page-header">
        <div>
          <Skeleton height="2.5rem" width="320px" />
          <Skeleton height="1rem" width="280px" style={{marginTop:'0.5rem'}} />
        </div>
        <Skeleton height="2.5rem" width="200px" />
      </header>
      <div className="analytics-grid">
        <div className="card span-full">
          <div className="card-header flex-between">
            <Skeleton height="1rem" width="220px" />
            <Skeleton height="1rem" width="80px" />
          </div>
          <div className="chart-container" style={{height:'300px'}}>
            <Skeleton height="300px" />
          </div>
        </div>
        <div className="card span-half">
          <div className="card-header"><Skeleton height="1rem" width="180px" /></div>
          <div className="chart-container" style={{height:'200px'}}>
            <Skeleton height="200px" />
          </div>
        </div>
        <div className="card span-half">
          <div className="card-header"><Skeleton height="1rem" width="160px" /></div>
          <div className="chart-container" style={{height:'200px'}}>
            <Skeleton height="200px" />
          </div>
        </div>
        <div className="card span-full impact-metrics">
          <div className="card-header"><Skeleton height="1rem" width="160px" /></div>
          <div className="impact-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="impact-item" style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                <Skeleton height="1rem" width="80px" />
                <Skeleton height="2.5rem" width="60px" />
                <Skeleton height="0.7rem" width="60px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function ErrorState({ message }) {
  return <div className="dashboard-container fade-in" style={{textAlign:'center',padding:'4rem'}}>
    <p className="text-muted">{message}</p>
  </div>;
}
function EmptyState({ message }) {
  return <div style={{textAlign:'center',padding:'2rem',color:'var(--text-secondary)',fontSize:'0.875rem'}}>{message}</div>;
}
