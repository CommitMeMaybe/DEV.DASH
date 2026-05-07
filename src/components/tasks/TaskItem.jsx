import './TaskItem.css';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />
      <span className="task-text">{task.text}</span>
      <span className="task-date">
        {new Date(task.createdAt).toLocaleDateString()}
      </span>
      <button onClick={() => onDelete(task.id)} className="delete-btn">
        ×
      </button>
    </div>
  );
}
