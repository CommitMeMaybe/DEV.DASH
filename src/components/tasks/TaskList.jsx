import TaskItem from './TaskItem';
import EmptyState from '../ui/EmptyState';
import './TaskList.css';

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <EmptyState title="No tasks yet" description="Add your first task above" />;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
