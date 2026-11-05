import { useTmdbInfo } from './useTmdbInfo';

export function useMovieTitle(movie) {
  const info = useTmdbInfo(movie.title, movie.releaseYear);
  return info.title || movie.title;
}