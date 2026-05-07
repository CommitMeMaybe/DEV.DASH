import { useState, useEffect, useCallback } from 'react';

const SESSION_KEY = 'devdash_session';
const SESSION_DURATION_MS = 60 * 60 * 1000;
const PERSISTENT_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 60 * 1000; // Check every 60s

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const session = JSON.parse(stored);
        if (session.expiry && new Date(session.expiry) > new Date()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(SESSION_KEY);
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
    const interval = setInterval(checkSession, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkSession]);

  const login = useCallback((stayLoggedIn = false) => {
    const session = {
      id: crypto.randomUUID(),
      expiry: new Date(Date.now() + (stayLoggedIn ? PERSISTENT_DURATION_MS : SESSION_DURATION_MS)).toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isLoading, login, logout };
}
