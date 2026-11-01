import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
}