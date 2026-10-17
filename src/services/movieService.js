import api from './api';

export async function getMovies(params = {}) {
  const { data } = await api.get('/movies', { params });
  return { movies: data.data, pagination: data.pagination };
}