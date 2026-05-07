import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../ui/Card';
import './QuickTaskPreview.css';

export default function QuickTaskPreview() {
  const [tasks] = useLocalStorage('devdash_tasks', []);
  const recentTasks = tasks.slice(0, 3);

  return (
    <Card className="quick-task-preview">
      <h3 className="section-title">Recent Tasks</h3>
      {recentTasks.length === 0 ? (
        <p className="empty-text">No tasks yet</p>
      ) : (
        <ul className="task-preview-list">
          {recentTasks.map(task => (
            <li key={task.id} className={`preview-item ${task.completed ? 'completed' : ''}`}>
              <span className="task-dot" />
              <span className="task-text">{task.text}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
