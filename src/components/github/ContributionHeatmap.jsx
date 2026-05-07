import React, { useMemo } from 'react';
import './ContributionHeatmap.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CELL_SIZE = 12;
const GAP = 3;

export default function ContributionHeatmap({ data }) {
  const { weeks, maxCount } = useMemo(() => {
    const entries = Object.entries(data || {}).sort(([a], [b]) => new Date(a) - new Date(b));
    if (!entries.length) return { weeks: [], maxCount: 0 };

    let weeks = [], currentWeek = [], max = 0;
    entries.forEach(([dateStr, count]) => {
      const d = new Date(dateStr);
      const dayOfWeek = d.getDay();
      while (currentWeek.length < dayOfWeek) currentWeek.push(null);
      currentWeek.push({ date: dateStr, count });
      if (dayOfWeek === 6) { weeks.push(currentWeek); currentWeek = []; }
      max = Math.max(max, count);
    });
    if (currentWeek.length) weeks.push(currentWeek);
    return { weeks, maxCount: max || 1 };
  }, [data]);

  if (!weeks.length) return <div className="text-muted" style={{padding:'1rem',textAlign:'center'}}>No activity data available</div>;

  const getColor = (count) => {
    if (!count) return 'var(--bg-surface)';
    const ratio = Math.min(count / Math.max(maxCount, 1), 1);
    if (ratio === 0) return 'rgba(56, 189, 248, 0.1)';
    if (ratio < 0.25) return 'rgba(56, 189, 248, 0.25)';
    if (ratio < 0.5) return 'rgba(56, 189, 248, 0.45)';
    if (ratio < 0.75) return 'rgba(56, 189, 248, 0.7)';
    return 'rgba(56, 189, 248, 1)';
  };

  return (
    <div className="heatmap-container">
      <div className="heatmap-days">
        {DAYS.map(d => <div key={d} className="heatmap-day-label">{d}</div>)}
      </div>
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {DAYS.map((_, di) => {
              const cell = week.find(c => new Date(c?.date).getDay() === di);
              return <div key={di} className="heatmap-cell"
                style={{ backgroundColor: getColor(cell?.count || 0), width: CELL_SIZE, height: CELL_SIZE }}
                title={cell ? `${cell.date}: ${cell.count} events` : ''}
              />;
            })}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span className="text-muted" style={{fontSize:'0.7rem'}}>LESS</span>
        {[0, 0.25, 0.5, 0.75, 1].map(r => (
          <div key={r} className="heatmap-cell" style={{ backgroundColor: `rgba(56, 189, 248, ${r || 0.15})`, width: CELL_SIZE, height: CELL_SIZE }} />
        ))}
        <span className="text-muted" style={{fontSize:'0.7rem'}}>MORE</span>
      </div>
    </div>
  );
}
