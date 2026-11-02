import api from './api';

export async function getFavorites() {
  const { data } = await api.get('/favorites');
  return data.data;
}