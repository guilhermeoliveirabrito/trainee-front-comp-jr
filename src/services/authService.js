import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
}

export async function register(name, email, password) {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data.data;
}