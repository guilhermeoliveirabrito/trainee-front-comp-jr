import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getUserRating, saveUserRating } from '../utils/ratingStorage';

export function useUserRating(movieId) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setVersion] = useState(0);

  const userKey = isAuthenticated ? (user.id ?? user.email) : null;
  const rating = userKey && movieId !== undefined ? getUserRating(userKey, movieId) : 0;

  function rate(value) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    saveUserRating(userKey, movieId, value === rating ? 0 : value);
    setVersion((current) => current + 1);
  }

  return { rating, rate, isAuthenticated };
}