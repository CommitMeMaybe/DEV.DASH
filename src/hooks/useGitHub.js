import { useState, useEffect, useCallback, useMemo } from 'react';

const GITHUB_API = 'https://api.github.com';
const PER_PAGE = 100;
const MAX_PAGES = 10;

function getHeaders() {
  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) headers['Authorization'] = `token ${token}`;
  return headers;
}

async function fetchGitHub(endpoint, params = {}) {
  const url = new URL(`${GITHUB_API}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString(), { headers: getHeaders() });
  if (!res.ok) throw new Error('GitHub API request failed.');
  return res.json();
}

async function fetchAllPages(endpoint, params = {}) {
  let page = 1, all = [];
  while (page <= MAX_PAGES) {
    const data = await fetchGitHub(endpoint, { ...params, page: page++, per_page: PER_PAGE });
    all = all.concat(data);
    if (!Array.isArray(data) || data.length < PER_PAGE) break;
  }
  return all;
}

const requestCache = new Map();
const CACHE_TTL_MS = 300_000; // 5 minutes

async function fetchWithCache(key, fn) {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  const data = await fn();
  requestCache.set(key, { data, timestamp: Date.now() });
  return data;
}

export default function useGitHub(username) {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState(null);
  const [events, setEvents] = useState(null);
  const [commits, setCommits] = useState(null);
  const [pulls, setPulls] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const load = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const [userData, reposData, eventsData] = await Promise.all([
        fetchWithCache(`gh_user_${username}`, () => fetchGitHub(`/users/${username}`)),
        fetchWithCache(`gh_repos_${username}`, () => fetchAllPages(`/users/${username}/repos`, { sort: 'pushed', direction: 'desc' })),
        fetchWithCache(`gh_events_${username}`, () => fetchAllPages(`/users/${username}/events/public`))
      ]);

      const repoNames = reposData.slice(0, 5).map(r => r.name);
      const [commitsData, pullsData] = await Promise.all([
        Promise.all(repoNames.map(r =>
          fetchWithCache(`gh_commits_${username}_${r}`, () =>
            fetchAllPages(`/repos/${username}/${r}/commits`, { since: new Date(Date.now() - 90*86400000).toISOString() })
              .then(d => d.map(c => ({ ...c, repo: r })))
              .catch(() => [])
          )
        )).then(arrs => arrs.flat()),
        Promise.all(repoNames.map(r =>
          fetchWithCache(`gh_pulls_${username}_${r}`, () =>
            fetchAllPages(`/repos/${username}/${r}/pulls`, { state: 'all' })
              .then(d => d.map(p => ({ ...p, repo: r })))
              .catch(() => [])
          )
        )).then(arrs => arrs.flat())
      ]);

      setUser(userData);
      setRepos(reposData);
      setEvents(eventsData);
      setCommits(commitsData);
      setPulls(pullsData);
      setLastSync(new Date());
    } catch {
      setError("Failed to load GitHub data.");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => { load(); }, [load]);

  const metrics = useMemo(() => {
    if (!commits || !pulls || !events) return null;
    const now = new Date();
    const weekAgo = new Date(now - 7 * 86400000);
    const commitsThisWeek = commits.filter(c => new Date(c.commit.author.date) >= weekAgo).length;

    const commitDates = commits.map(c => new Date(c.commit.author.date).toDateString());
    const uniqueDates = [...new Set(commitDates)].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date(now - i * 86400000).toDateString();
      if (uniqueDates[i] === expected) streak++;
      else break;
    }

    const merged = pulls.filter(p => p.merged_at).length;
    const mergeRate = pulls.length ? ((merged / pulls.length) * 100).toFixed(1) : 0;

    const monthAgo = new Date(now - 30 * 86400000);
    const starsGained = repos.reduce((sum, r) => {
      const created = new Date(r.created_at);
      return created > monthAgo ? sum : sum + (r.stargazers_count || 0);
    }, 0);

    const activityByDate = {};
    events.forEach(e => {
      const date = new Date(e.created_at).toISOString().split('T')[0];
      activityByDate[date] = (activityByDate[date] || 0) + 1;
    });

    const topRepo = repos && repos[0] ? repos[0] : null;
    const langCount = {};
    repos?.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
    const dominantLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const insights = [];
    if (streak === 0) insights.push({ type: 'warning', text: 'No commits today. Streak at risk!' });
    else if (streak < 3) insights.push({ type: 'warning', text: `Short streak (${streak}d). Push code today to build momentum.` });
    else insights.push({ type: 'success', text: `Great streak of ${streak} days! Keep the momentum.` });
    if (commitsThisWeek > 50) insights.push({ type: 'info', text: `High activity this week (${commitsThisWeek} commits). Consider breaking work into smaller PRs.` });
    if (parseFloat(mergeRate) < 50) insights.push({ type: 'warning', text: `Low PR merge rate (${mergeRate}%). Review PR workflow.` });

    return { commitsThisWeek, streak, mergeRate, starsGained, activityByDate, topRepo, dominantLang, insights, activityByDate };
  }, [commits, pulls, events, repos]);

  return { user, repos, events, commits, pulls, metrics, loading, error, lastSync, reload: load };
}
