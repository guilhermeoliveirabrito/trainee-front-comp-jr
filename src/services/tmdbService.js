import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const CACHE_KEY = 'meucine:tmdb';
const PLACEHOLDER_HOSTS = [
  'placehold.co',
  'placeholder.com',
  'dummyimage.com',
  'example.com',
];

export const EMPTY_INFO = { poster: '', title: '' };

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

async function requestResults(title, year) {
  const { data } = await axios.get(SEARCH_URL, {
    params: { api_key: API_KEY, query: title, year, language: 'pt-BR' },
  });
  return data.results ?? [];
}

function pickInfo(results, year) {
  const candidates = results.filter((item) => {
    if (!year) return true;
    return Math.abs(Number(item.release_date?.slice(0, 4)) - year) <= 1;
  });
  const found = candidates.find((item) => item.poster_path) ?? candidates[0];

  if (!found) return EMPTY_INFO;

  return {
    poster: found.poster_path ? `${IMAGE_BASE_URL}${found.poster_path}` : '',
    title: found.title ?? '',
  };
}

async function searchMovie(title, year) {
  const withYear = pickInfo(await requestResults(title, year), year);
  if (withYear !== EMPTY_INFO) return withYear;
  return pickInfo(await requestResults(title), year);
}

export function isPlaceholderUrl(url) {
  try {
    const { hostname } = new URL(url);
    return PLACEHOLDER_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return true;
  }
}

export function getCachedMovieInfo(title, releaseYear) {
  return readCache()[cacheKey(title, releaseYear)];
}

export function fetchMovieInfo(title, releaseYear) {
  if (!API_KEY || !title) return Promise.resolve(EMPTY_INFO);

  const key = cacheKey(title, releaseYear);
  if (pending.has(key)) return pending.get(key);

  const request = searchMovie(title, releaseYear)
    .then((info) => {
      writeCache({ ...readCache(), [key]: info });
      return info;
    })
    .finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}