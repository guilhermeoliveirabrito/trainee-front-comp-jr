import { useEffect, useState } from 'react';
import { EMPTY_INFO, fetchMovieInfo, getCachedMovieInfo } from '../services/tmdbService';

export function useTmdbInfo(title, releaseYear) {
  const key = `${title}|${releaseYear}`;
  const [fetched, setFetched] = useState({ key: '', info: EMPTY_INFO });

  const cached = getCachedMovieInfo(title, releaseYear);
  const hasCache = cached !== undefined;

  useEffect(() => {
    if (!title || hasCache) return undefined;

    let active = true;

    // se falhar, cai no vazio e a tela mostra a capa gerada
    fetchMovieInfo(title, releaseYear)
      .then((info) => {
        if (active) setFetched({ key, info });
      })
      .catch(() => {
        if (active) setFetched({ key, info: EMPTY_INFO });
      });

    return () => {
      active = false;
    };
  }, [hasCache, key, title, releaseYear]);

  if (hasCache) return cached;
  return fetched.key === key ? fetched.info : EMPTY_INFO;
}