import axios from 'axios';
import { clearSession, getToken } from '../utils/storage';

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
    const isAuthRequest = error.config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && getToken() && !isAuthRequest) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default api;