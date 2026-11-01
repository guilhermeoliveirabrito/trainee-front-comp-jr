import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginRequest } from '../services/authService';
import { clearSession, getStoredUser, getToken, saveSession } from '../utils/storage';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));

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