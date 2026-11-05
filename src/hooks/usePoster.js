import { useEffect, useState } from 'react';
import { fetchPoster, getCachedPoster, isPlaceholderUrl } from '../services/posterService';

export function usePoster(movie) {
  const { title, releaseYear, posterUrl } = movie;
  const key = `${title}|${releaseYear}`;
  const hasOwnPoster = Boolean(posterUrl) && !isPlaceholderUrl(posterUrl);
  const [stage, setStage] = useState(hasOwnPoster ? 'own' : 'tmdb');
  const [fetched, setFetched] = useState({ key: '', url: '' });

  const cached = getCachedPoster(title, releaseYear);

  let tmdbUrl = '';
  if (cached !== undefined) {
    tmdbUrl = cached;
  } else if (fetched.key === key) {
    tmdbUrl = fetched.url;
  }

  useEffect(() => {
    if (stage !== 'tmdb' || cached !== undefined) return undefined;

    let active = true;

    fetchPoster(title, releaseYear)
      .then((url) => {
        if (active) setFetched({ key, url });
      })
      .catch(() => {
        if (active) setFetched({ key, url: '' });
      });

    return () => {
      active = false;
    };
  }, [stage, cached, key, title, releaseYear]);

  const sources = { own: posterUrl, tmdb: tmdbUrl, none: '' };

  function onError() {
    setStage((current) => (current === 'own' ? 'tmdb' : 'none'));
  }

  return { src: sources[stage], onError };
}