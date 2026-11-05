import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const CACHE_KEY = 'meucine:posters';

const pending = new Map();

function cacheKey(title, releaseYear) {
  return `${title}|${releaseYear}`;
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    return;
  }
}

async function searchPoster(title, year) {
  const { data } = await axios.get(SEARCH_URL, {
    params: { api_key: API_KEY, query: title, year, language: 'pt-BR' },
  });
  const found = data.results?.find((item) => item.poster_path);
  return found ? `${IMAGE_BASE_URL}${found.poster_path}` : '';
}

export function getCachedPoster(title, releaseYear) {
  return readCache()[cacheKey(title, releaseYear)];
}

export function fetchPoster(title, releaseYear) {
  if (!API_KEY) return Promise.resolve('');

  const key = cacheKey(title, releaseYear);
  if (pending.has(key)) return pending.get(key);

  const request = searchPoster(title, releaseYear)
    .then((url) => (url ? url : searchPoster(title)))
    .then((url) => {
      writeCache({ ...readCache(), [key]: url });
      return url;
    })
    .finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}