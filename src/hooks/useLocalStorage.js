import { useState, useEffect } from 'react';

const MAX_STORAGE_SIZE = 100_000; // ~100KB per key

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const serialized = JSON.stringify(value);
      if (serialized.length > MAX_STORAGE_SIZE) {
        console.warn(`Storage limit exceeded for key: ${key}`);
        return;
      }
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.warn(`Failed to save to localStorage: ${key}`);
    }
  }, [key, value]);

  return [value, setValue];
}
