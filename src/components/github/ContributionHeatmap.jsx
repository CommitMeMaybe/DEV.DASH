import React, { useMemo } from 'react';
import './ContributionHeatmap.css';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const CELL_SIZE = 12;
const GAP = 3;

export default function ContributionHeatmap({ data }) {
  const { weeks, maxCount } = useMemo(() => {
    const entries = Object.entries(data || {}).sort(([a], [b]) => new Date(a) - new Date(b));
    if (!entries.length) return { weeks: [], maxCount: 0 };

    const startDate = new Date(entries[0][0]);
    const endDate = new Date(entries[entries.length - 1][0]);
    const startDay = startDate.getDay();

    const dateMap = {};
    entries.forEach(([dateStr, count]) => { dateMap[dateStr] = count; });

    let weeks = [], currentWeek = new Array(7).fill(null);
    for (let i = 0; i < startDay; i++) currentWeek[i] = 0;

    let cursor = new Date(startDate);
    while (cursor <= endDate) {
      const dateStr = cursor.toISOString().split('T')[0];
      const dayOfWeek = cursor.getDay();
      currentWeek[dayOfWeek] = dateMap[dateStr] || 0;
      if (dayOfWeek === 6) { weeks.push(currentWeek); currentWeek = new Array(7).fill(null); }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (currentWeek.some(v => v !== null)) weeks.push(currentWeek);

    const allCounts = entries.map(([, c]) => c);
    return { weeks, maxCount: Math.max(...allCounts, 1) };
  }, [data]);

  if (!weeks.length) return <div className="text-muted" style={{padding:'1rem',textAlign:'center'}}>No activity data available</div>;

  const getColor = (count) => {
    if (!count) return 'var(--bg-surface)';
    const ratio = Math.min(count / maxCount, 1);
    if (ratio < 0.25) return 'rgba(0, 255, 153, 0.15)';
    if (ratio < 0.5) return 'rgba(0, 255, 153, 0.35)';
    if (ratio < 0.75) return 'rgba(0, 255, 153, 0.6)';
    return 'rgba(0, 255, 153, 0.9)';
  };

  return (
    <div className="heatmap-container">
      <div className="heatmap-body">
        <div className="heatmap-labels">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="heatmap-day-label" style={{ height: CELL_SIZE }}>
              {label}
            </div>
          ))}
        </div>
        <div className="heatmap-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="heatmap-week">
              {week.map((count, di) => {
                const dateStr = data ? Object.keys(data).sort().find(d => new Date(d).getDay() === di) : '';
                return (
                  <div key={di} className="heatmap-cell"
                    style={{ backgroundColor: getColor(count), width: CELL_SIZE, height: CELL_SIZE }}
                    title={count > 0 ? `${count} events` : 'No activity'}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span className="text-muted" style={{fontSize:'0.7rem'}}>LESS</span>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <div key={i} className="heatmap-cell" style={{
            backgroundColor: r === 0 ? 'var(--bg-surface)' : `rgba(0, 255, 153, ${r * 0.9})`,
            width: CELL_SIZE, height: CELL_SIZE
          }} />
        ))}
        <span className="text-muted" style={{fontSize:'0.7rem'}}>MORE</span>
      </div>
    </div>
  );
}
