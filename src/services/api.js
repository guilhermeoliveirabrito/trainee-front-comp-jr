import axios from 'axios';
import { clearSession, getToken } from '../utils/storage';

// o axios não enxerga o estado do react, então aviso a queda da sessão por evento
export const SESSION_EXPIRED_EVENT = 'meucine:session-expired';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 fora do /auth/ é token expirado ou inválido
    // no login o 401 é só senha errada, aí não derruba a sessão
    const isAuthRequest = error.config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && getToken() && !isAuthRequest) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default api;