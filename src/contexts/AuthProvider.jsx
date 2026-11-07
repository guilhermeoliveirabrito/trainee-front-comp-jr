import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { SESSION_EXPIRED_EVENT } from '../services/api';
import { login as loginRequest } from '../services/authService';
import { clearSession, getStoredUser, getToken, saveSession } from '../utils/storage';

export default function AuthProvider({ children }) {
  // só usa o usuário salvo se ainda tiver token
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));

  useEffect(() => {
    // o interceptor do axios dispara isso quando a API recusa o token
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

  function updateUser(changes) {
    const nextUser = { ...user, ...changes };
    saveSession(getToken(), nextUser);
    setUser(nextUser);
  }

  const value = { user, isAuthenticated: Boolean(user), login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}