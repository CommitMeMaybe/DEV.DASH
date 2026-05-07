import { useState } from 'react';
import { sanitizeInput } from '../../utils/sanitize';
import './TaskForm.css';

export default function TaskForm({ onAddTask }) {
  const [formState, setFormState] = useState({ text: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    setFormState({ text: sanitized });
    setError(sanitized.length >= 200 ? 'Max 200 characters' : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.text.trim()) return;
    onAddTask({
      id: crypto.randomUUID(),
      text: formState.text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setFormState({ text: '' });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={formState.text}
          onChange={handleChange}
          placeholder="Add a new task..."
          className="task-input"
          maxLength={200}
        />
        <button type="submit" className="add-btn" disabled={!formState.text.trim()}>
          Add
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
      <p className="char-count">{formState.text.length}/200</p>
    </form>
  );
}
