import api from './api';

export async function getMovies(params = {}) {
  const { data } = await api.get('/movies', { params });
  return { movies: data.data, pagination: data.pagination };
}

export async function getMovieById(id) {
  const { data } = await api.get(`/movies/${id}`);
  return data.data;
}

export async function createMovie(payload) {
  const { data } = await api.post('/movies', payload);
  return data.data;
}

export async function updateMovie(id, payload) {
  const { data } = await api.put(`/movies/${id}`, payload);
  return data.data;
}

export async function deleteMovie(id) {
  await api.delete(`/movies/${id}`);
}