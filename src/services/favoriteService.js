import api from './api';

export async function getFavorites() {
  const { data } = await api.get('/favorites');
  return data.data;
}

export async function addFavorite(movieId) {
  await api.post(`/favorites/${movieId}`);
}

export async function removeFavorite(movieId) {
  await api.delete(`/favorites/${movieId}`);
}