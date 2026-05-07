import { useState, useEffect, useCallback } from 'react';
import { safeObjectMerge } from '../utils/sanitize';

const STORAGE_KEY = 'devdash_tasks';
const MAX_STORAGE_SIZE = 100_000;

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(t => t && t.id && t.title !== undefined) : [];
  }
  catch { return []; }
}

export default function useTasks() {
  const [tasks, setTasks] = useState(loadTasks);
  const [storageError, setStorageError] = useState(null);

  useEffect(() => {
    try {
      const serialized = JSON.stringify(tasks);
      if (serialized.length > MAX_STORAGE_SIZE) {
        setStorageError('Task list too large to save. Remove completed tasks to free space.');
        return;
      }
      localStorage.setItem(STORAGE_KEY, serialized);
      setStorageError(null);
    } catch {
      setStorageError('Failed to save tasks. Storage may be full.');
    }
  }, [tasks]);

  const addTask = useCallback((title, description = '') => {
    const task = { id: crypto.randomUUID(), title, description, done: false, createdAt: new Date().toISOString() };
    setTasks(prev => [task, ...prev]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const removeTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? safeObjectMerge(t, updates) : t));
  }, []);

  return { tasks, addTask, toggleTask, removeTask, updateTask, storageError };
}
