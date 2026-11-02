import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { SESSION_EXPIRED_EVENT } from '../services/api';
import { login as loginRequest } from '../services/authService';
import { clearSession, getStoredUser, getToken, saveSession } from '../utils/storage';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));

  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  async function login(email, password) {
    const session = await loginRequest(email, password);
    saveSession(session.token, session.user);
    setUser(session.user);
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = { user, isAuthenticated: Boolean(user), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}