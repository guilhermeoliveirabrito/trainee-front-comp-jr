import api from './api';

export async function getMovies(params = {}) {
  const { data } = await api.get('/movies', { params });
  return { movies: data.data, pagination: data.pagination };
}

export async function getMovieById(id) {
  const { data } = await api.get(`/movies/${id}`);
  return data.data;
}