import api from './api';

export async function updateProfile(payload) {
  await api.put('/users/me', payload);
}