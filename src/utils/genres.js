export const GENRES = [
  { value: 'Acao', label: 'Ação' },
  { value: 'Animacao', label: 'Animação' },
  { value: 'Aventura', label: 'Aventura' },
  { value: 'Biografia', label: 'Biografia' },
  { value: 'Comedia', label: 'Comédia' },
  { value: 'Crime', label: 'Crime' },
  { value: 'Drama', label: 'Drama' },
  { value: 'Fantasia', label: 'Fantasia' },
  { value: 'Ficcao Cientifica', label: 'Ficção Científica' },
  { value: 'Musical', label: 'Musical' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Terror', label: 'Terror' },
  { value: 'Thriller', label: 'Thriller' },
];

export function getGenreLabel(value) {
  return GENRES.find((genre) => genre.value === value)?.label ?? value;
}