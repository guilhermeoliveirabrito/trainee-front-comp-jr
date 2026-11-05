import { useState } from 'react';
import { isPlaceholderUrl } from '../services/tmdbService';
import { useTmdbInfo } from './useTmdbInfo';

export function usePoster(movie) {
  const { title, releaseYear, posterUrl } = movie;
  const info = useTmdbInfo(title, releaseYear);
  const hasOwnPoster = Boolean(posterUrl) && !isPlaceholderUrl(posterUrl);
  const [ownFailed, setOwnFailed] = useState(false);
  const [tmdbFailed, setTmdbFailed] = useState(false);

  const usingOwn = hasOwnPoster && !ownFailed;

  let src = '';
  if (usingOwn) {
    src = posterUrl;
  } else if (!tmdbFailed) {
    src = info.poster;
  }

  function onError() {
    if (usingOwn) {
      setOwnFailed(true);
    } else {
      setTmdbFailed(true);
    }
  }

  return { src, onError };
}