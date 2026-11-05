const PREFIX = 'meucine:ratings:';

function read(userKey) {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}${userKey}`)) || {};
  } catch {
    return {};
  }
}

function write(userKey, ratings) {
  try {
    localStorage.setItem(`${PREFIX}${userKey}`, JSON.stringify(ratings));
  } catch {
    return;
  }
}

export function getUserRating(userKey, movieId) {
  return read(userKey)[movieId] ?? 0;
}

export function saveUserRating(userKey, movieId, value) {
  const ratings = read(userKey);

  if (value > 0) {
    ratings[movieId] = value;
  } else {
    delete ratings[movieId];
  }

  write(userKey, ratings);
}